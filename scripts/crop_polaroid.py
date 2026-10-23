"""Find and crop the inner photo of Ashton's Polaroid-style images.

Each source image is a white "print" with a drop shadow and a handwritten
caption baked in under the photo. We locate the photo by looking for the
longest run of rows (then columns) that are mostly non-white, which skips
the white border, the thin shadow and the sparse handwriting.

Usage:
  python3 -I scripts/crop_polaroid.py detect SRC.jpg            -> prints box as fractions
  python3 -I scripts/crop_polaroid.py crop SRC BOX_SRC OUT [inset]
     crops SRC using the box detected on BOX_SRC (fractions, so it also works
     on an upscaled copy of the same image).
"""
import json
import sys

import numpy as np
from PIL import Image

WHITE = 238          # a pixel brighter than this on all channels counts as paper
ROW_FILL = 0.55      # a row belongs to the photo when this share of it is not paper


def longest_run(mask: np.ndarray) -> tuple[int, int]:
    best, start, cur = (0, 0), None, 0
    for i, v in enumerate(list(mask) + [False]):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start > best[1] - best[0]:
                best = (start, i)
            start = None
    return best


def detect(path: str) -> dict:
    img = np.asarray(Image.open(path).convert("RGB")).astype(np.int16)
    h, w, _ = img.shape
    ink = ~(img > WHITE).all(axis=2)                     # True where not paper
    rows = ink.mean(axis=1) > ROW_FILL
    top, bottom = longest_run(rows)
    band = ink[top:bottom]
    cols = band.mean(axis=0) > 0.8
    left, right = longest_run(cols)

    # Every print holds a square photo (350 px on a 430 px print). Bright walls
    # or windows can fool one edge, so anchor on whichever edge looks sane and
    # rebuild the other from the known size.
    side = round(350 / 430 * w)
    if not (left < 0.12 * w):
        left = right - side
    right = left + side
    if not (top < 0.08 * h):
        top = bottom - side
    bottom = top + side
    return {"x0": left / w, "y0": top / h, "x1": right / w, "y1": bottom / h,
            "px": [left, top, right, bottom], "size": [w, h]}


def crop(src: str, box_src: str, out: str, inset: float = 0.006) -> None:
    box = detect(box_src)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    # Inset slightly so no paper edge or border line survives the crop.
    x0 = int((box["x0"] + inset) * w)
    y0 = int((box["y0"] + inset) * h)
    x1 = int((box["x1"] - inset) * w)
    y1 = int((box["y1"] - inset) * h)
    im.crop((x0, y0, x1, y1)).save(out, quality=95)
    print(json.dumps({"out": out, "crop": [x0, y0, x1, y1], "from": [w, h]}))


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "detect":
        print(json.dumps(detect(sys.argv[2])))
    elif cmd == "crop":
        inset = float(sys.argv[5]) if len(sys.argv) > 5 else 0.006
        crop(sys.argv[2], sys.argv[3], sys.argv[4], inset)
