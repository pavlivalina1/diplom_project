import torch.nn as nn
from torchvision.models import mobilenet_v2

def build_model(num_classes: int):
    model = mobilenet_v2(pretrained=False)
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    return model