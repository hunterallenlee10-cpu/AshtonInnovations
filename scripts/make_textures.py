"""Turn the generated texture squares into web-ready, tileable textures.

1. Flatten low-frequency lighting (divide by a heavy blur, restore the mean),
   so tiles don't show bright and dark patches when repeated.
2. Make them tile: blend the half-offset copy (seamless at the borders) with
   the original (seamless in the middle) through a feathered cross mask.
3. Export WebP (and a JPG for the WebGL shader where needed) to public/textures.

Run: python3 -I scripts/make_textures.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw" / "tex"
OUT = ROOT / "public" / "textures"
OUT.mkdir(parents=True, exist_ok=True)

JOBS = [
    # name, source, size, flatten strength (0..1), tile
    ("e1-solid", "e1_501.png", 1024, 1.0, True),
    ("e2-flake", "e2_603.png", 1024, 0.8, True),
    ("e3-metallic", "e3_702.png", 1024, 0.0, False),  # shader uses mirrored repeat
    ("e4-plaster", "e4_801.png", 1024, 1.0, True),
    ("e5-knockdown", "e5_901.png", 1024, 0.7, True),
]


def flatten(a: np.ndarray, strength: float) -> np.ndarray:
    if strength <= 0:
        return a
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    blur = np.asarray(img.filter(ImageFilter.GaussianBlur(radius=a.shape[0] / 6))).astype(np.float32)
    mean = a.reshape(-1, 3).mean(axis=0)
    flat = a / np.maximum(blur, 1) * mean
    return a * (1 - strength) + flat * strength


def make_tileable(a: np.ndarray, band: float = 0.18) -> np.ndarray:
    h, w, _ = a.shape
    rolled = np.roll(np.roll(a, h // 2, axis=0), w // 2, axis=1)
    y = np.abs(np.arange(h) - h / 2) / (h / 2)  # 0 at centre, 1 at edges
    x = np.abs(np.arange(w) - w / 2) / (w / 2)
    # weight of the original: 1 near the centre cross (where `rolled` has its seams)
    wy = np.clip(1 - y / band, 0, 1)
    wx = np.clip(1 - x / band, 0, 1)
    m = np.maximum(wy[:, None], wx[None, :])
    m = m * m * (3 - 2 * m)  # smoothstep
    return rolled * (1 - m[..., None]) + a * m[..., None]


for name, src, size, strength, tile in JOBS:
    p = RAW / src
    if not p.exists():
        print("missing", p)
        continue
    im = Image.open(p).convert("RGB").resize((size, size), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    a = flatten(a, strength)
    if tile:
        a = make_tileable(a)
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    out.save(OUT / f"{name}.webp", quality=82, method=6)
    if name in ("e1-solid", "e2-flake", "e3-metallic"):
        out.save(OUT / f"{name}.jpg", quality=86, optimize=True, progressive=True)
    # 3x3 preview for review
    prev = Image.new("RGB", (size * 3 // 2, size * 3 // 2))
    t = out.resize((size // 2, size // 2))
    for i in range(3):
        for j in range(3):
            prev.paste(t, (i * size // 2, j * size // 2))
    prev.save(ROOT / "assets" / f"tile_preview_{name}.jpg", quality=80)
    print("ok", name)
