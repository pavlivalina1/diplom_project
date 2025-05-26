import torch
from PIL import Image
from fastapi import APIRouter, Request, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from torchvision import transforms

import base64
from io import BytesIO
from src.database import get_db
from src.models import History

model_router = APIRouter()

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


@model_router.post("/predict/disease")
async def predict(
        request: Request,
        file: UploadFile = File(...),
        db: Session = Depends(get_db)
):
    contents = await file.read()
    image = Image.open(BytesIO(contents)).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0).to("cpu")

    model = request.app.state.disease_model
    classes = request.app.state.disease_classes

    llm = request.app.state.llm

    with torch.no_grad():
        output = model(input_tensor)
        predicted = torch.argmax(output, dim=1).item()
    recommendations = llm.generate_answer(
        f"Надай рекомендації щодо лікування цієї хвороби соняшника трьома реченнями(українською мовою). Хвороба: {classes[predicted]}")

    history_record = History(
        image_data=contents,
        type="disease",
        class_name=classes[predicted],
        recommendations=recommendations
    )

    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    return JSONResponse({"predicted_class": classes[predicted], "recommendation": recommendations})


@model_router.post("/predict/growth")
async def predict_growth(
        request: Request,
        file: UploadFile = File(...),
        task: str = "growth"
):
    contents = await file.read()
    image = Image.open(BytesIO(contents)).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0).to("cpu")

    model = request.app.state.growth_model
    classes = request.app.state.growth_classes

    llm = request.app.state.llm

    with torch.no_grad():
        output = model(input_tensor)
        predicted = torch.argmax(output, dim=1).item()

    return JSONResponse({"predicted_class": classes[predicted], "recommendation": llm.generate_answer(f"""Ось опис кожної стадії росту соняшника: 1th class: Images were taken from the first emergence from the soil (cotyledon) to the 4-5 leaf stage.

2th class: Images were taken from the 5-6 leaf stage to the 10-11 leaf stage. The distances between the plants have decreased, overlapping has begun. The plant rows have begun to become clear.

3th class: Images were taken from the 11-12 leaf stage to the formation of the flower head. The soil ground is almost completely covered with plants. Vivid green tones dominate.

4th class: Flower beds have begun to open. The flowering process in the middle of the bed has begun. When viewed from above, yellow ray flowers have begun to be seen. Flower heads are upright.

5th class: The flowering process on the bed is complete or close to complete. Flower beds have begun to bend. Yellow ray flowers continue to be seen.

6th class: Flowering is complete, flower beds are completely bent. Yellow ray flowers have almost completely fallen off. Green leaves have started to fade.

7th class: The back of the beds have turned light yellow. Plants can be seen separately. Green leaves have completely faded, soil ground has started to be seen.

8th class: Physiological maturity is complete. Flower beds and bracts have turned brown. Suitable for harvest. Трьома реченнями, суцільним текстом, українською мовою опиши дану стадію росту та дай рекомендації: {classes[predicted]}""")})

@model_router.get("/history/")
def get_all_history(db: Session = Depends(get_db)):
    records = (
        db.query(History)
        .order_by(History.id.desc())  # спочатку найновіші
        .limit(10)  # лише 10
        .all()
    )
    result = []

    for record in records:
        # Encode image to base64
        encoded_image = base64.b64encode(record.image_data).decode("utf-8")
        result.append({
            "id": record.id,
            "type": record.type,
            "class_name": record.class_name,
            "recommendations": record.recommendations,
            "image_base64": encoded_image
        })

    return JSONResponse(content=result)