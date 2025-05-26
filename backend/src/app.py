import torch
import torch.nn as nn
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from torchvision.models import mobilenet_v2

from src.database import get_db
from src.llm import LLM
from src.model_router import model_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your mobile IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cpu")

# === Конфігурація ===
num_growth_classes = 8
num_disease_classes = 4

# === Класи ===
growth_classes = [f"{i + 1} стадія росту" for i in range(num_growth_classes)]
disease_classes = ["Несправжня борошниста роса", "Здорова рослина", "Сіра гниль", "Септоспоріоз"]

# === Модель росту ===
growth_model = mobilenet_v2(weights=None)
growth_model.classifier[1] = nn.Linear(growth_model.last_channel, num_growth_classes)
growth_model.load_state_dict(torch.load("src/model/sunflower_growth_model_mobilenet2.pth", map_location=device))
growth_model.to(device)
growth_model.eval()

# === Модель хвороб ===
disease_model = mobilenet_v2(weights=None)
disease_model.classifier[1] = nn.Linear(disease_model.last_channel, num_disease_classes)
disease_model.load_state_dict(torch.load("src/model/best_mobilenet_model.pth", map_location=device))
disease_model.to(device)
disease_model.eval()

# === Збереження моделей та класів у FastAPI app ===
app.state.growth_model = growth_model
app.state.disease_model = disease_model
app.state.growth_classes = growth_classes
app.state.disease_classes = disease_classes

llm = LLM("3uTKE448T558Qmem6pBSbvW54nHBR4FP6Xnn6jCl")
app.state.llm = llm

# === Сервіс доступності ===
@app.get("/health")
def health():
    return JSONResponse({"status": "ok"})


# === Роути ===
app.include_router(model_router)

if __name__ == "__main__":
    get_db()
    uvicorn.run("src.app:app", host="127.0.0.1", port=8000, reload=True)
