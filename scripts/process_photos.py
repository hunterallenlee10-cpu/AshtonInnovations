"""Crop the AI-upscaled Polaroids to the inner photo and export for the web.

For each photo:
  - detect the inner-photo box on the ORIGINAL print (crop_polaroid.detect),
  - apply that box (as fractions) to the upscaled print,
  - resize to 1400 px (about 4x the 350 px original photo) and save JPEG.
  - build a review sheet: original crop (plain resize) | AI upscale, same size.

Rejected upscales (listed in REJECT) fall back to the plain resize of the
original crop instead.

Run: python3 -I scripts/process_photos.py [names...]
"""
import sys
from pathlib import Path

from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from crop_polaroid import detect  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "public" / "work" / "originals"
UP = ROOT / "assets" / "raw" / "upscale"
OUT = ROOT / "public" / "work"
CMP = ROOT / "assets" / "compare"
CMP.mkdir(parents=True, exist_ok=True)

SIZE = 1400
REJECT: set[str] = {"24"}  # upscaler changed the small centre rosette into a vent-like disk


def box_crop(im: Image.Image, box: dict, inset: float = 0.006) -> Image.Image:
    w, h = im.size
    return im.crop((
        int((box["x0"] + inset) * w),
        int((box["y0"] + inset) * h),
        int((box["x1"] - inset) * w),
        int((box["y1"] - inset) * h),
    ))


def truck_box(path: Path) -> dict:
    # Circle photo on white: bounding box of non-white pixels.
    im = Image.open(path).convert("L")
    bw = im.point(lambda v: 255 if v < 240 else 0)
    l, t, r, b = bw.getbbox()
    w, h = im.size
    return {"x0": l / w, "y0": t / h, "x1": r / w, "y1": b / h}


def process(name: str) -> None:
    orig_p = ORIG / f"{name}.jpg"
    up_p = UP / f"{name}.png"
    box = truck_box(orig_p) if name == "truck" else detect(str(orig_p))
    inset = 0.0 if name == "truck" else 0.006
    orig = Image.open(orig_p).convert("RGB")
    plain = box_crop(orig, box, inset)
    w = SIZE
    h = round(SIZE * plain.height / plain.width)
    plain_big = plain.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))

    if up_p.exists():
        up = box_crop(Image.open(up_p).convert("RGB"), box, inset).resize((w, h), Image.LANCZOS)
    else:
        up = None

    chosen = plain_big if (up is None or name in REJECT) else up
    chosen.save(OUT / f"{name}.jpg", quality=82, optimize=True, progressive=True)

    if up is not None:
        sheet = Image.new("RGB", (w * 2 + 20, h), "white")
        sheet.paste(plain_big, (0, 0))
        sheet.paste(up, (w + 20, 0))
        sheet.thumbnail((1800, 1000))
        sheet.save(CMP / f"{name}.jpg", quality=85)
    print(name, "upscale" if chosen is up else "plain", chosen.size)


if __name__ == "__main__":
    names = sys.argv[1:] or sorted(p.stem for p in ORIG.glob("*.jpg") if p.stem != "splash")
    for n in names:
        process(n)
