# Usage: python scripts/generate-depth-maps.py public/photo.jpg  →  public/photo-depth.png + public/photo-normal.png
# Needs torch, transformers and numpy. Uses Depth Anything V2 Small (Apache 2.0).
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from transformers import AutoModelForDepthEstimation

MODEL = "depth-anything/Depth-Anything-V2-Small-hf"
WORK_W = 1050  # prediction width, a multiple of 14 as the model requires
RELIEF = 140.0  # relief depth in pixels at WORK_W, sets baked normal strength

src = Path(sys.argv[1])
photo = Image.open(src).convert("RGB")
WORK_H = round(WORK_W * photo.height / photo.width / 14) * 14

device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
model = AutoModelForDepthEstimation.from_pretrained(MODEL).to(device).eval()
MEAN = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
STD = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)


def predict(image: Image.Image) -> torch.Tensor:
    resized = np.asarray(image.resize((WORK_W, WORK_H), Image.BICUBIC), dtype=np.float32) / 255.0
    pixels = ((torch.from_numpy(resized).permute(2, 0, 1) - MEAN) / STD)[None]
    with torch.no_grad():
        disparity = model(pixel_values=pixels.to(device)).predicted_depth
    disparity = F.interpolate(disparity[:, None], size=(WORK_H, WORK_W), mode="bicubic", align_corners=False)
    return disparity[0, 0].float().cpu()


def gaussian(field: torch.Tensor, sigma: float) -> torch.Tensor:
    radius = max(1, int(sigma * 3))
    x = torch.arange(-radius, radius + 1, dtype=torch.float32)
    kernel = torch.exp(-(x**2) / (2 * sigma**2))
    kernel /= kernel.sum()
    f = field[None, None]
    f = F.conv2d(F.pad(f, (radius, radius, 0, 0), mode="replicate"), kernel.view(1, 1, 1, -1))
    f = F.conv2d(F.pad(f, (0, 0, radius, radius), mode="replicate"), kernel.view(1, 1, -1, 1))
    return f[0, 0]


# Averaging with the mirrored prediction cancels most one-sided artifacts.
disparity = (predict(photo) + torch.flip(predict(photo.transpose(Image.FLIP_LEFT_RIGHT)), dims=[1])) / 2
lo, hi = torch.quantile(disparity.flatten()[::7], torch.tensor([0.02, 0.998]))
depth = gaussian(((disparity - lo) / (hi - lo)).clamp(0, 1), 0.8)

# Normals are computed here in float precision; deriving them in the browser from
# an 8-bit depth PNG would show visible stair-stepping on smooth curves.
height = gaussian(depth, 1.4) * RELIEF
gy, gx = torch.gradient(height)
normal = torch.stack([-gx, gy, torch.ones_like(height)], dim=-1)  # image rows go down, GL y goes up
normal = normal / normal.norm(dim=-1, keepdim=True)

depth_path = src.with_name(f"{src.stem}-depth.png")
normal_path = src.with_name(f"{src.stem}-normal.png")
Image.fromarray((depth.numpy() * 255).round().astype(np.uint8), mode="L").save(depth_path, optimize=True)
Image.fromarray(((normal.numpy() * 0.5 + 0.5) * 255).round().astype(np.uint8), mode="RGB").save(normal_path, optimize=True)
print(f"{depth_path}\n{normal_path}")
