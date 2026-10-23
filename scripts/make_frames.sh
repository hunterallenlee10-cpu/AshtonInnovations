#!/usr/bin/env bash
# Build the hero scroll-sequence from the two Higgsfield clips.
#
# usage: scripts/make_frames.sh clip1.mp4 clip2.mp4 [quality]
#
# Writes:
#   public/frames/desktop/f_0001.webp ...  (1920x1080)
#   public/frames/mobile/f_0001.webp  ...  (720x1280, the same footage rotated
#                                           90 degrees clockwise: looking straight
#                                           up there is no "up", so this is a true
#                                           portrait view with identical geometry)
#   public/frames/manifest.json
#   public/video/poster-start.jpg, poster-start-mobile.jpg, hero-scrub.mp4
set -euo pipefail
C1="$1"; C2="$2"; Q="${3:-66}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public"
TMP="$(mktemp -d)"
mkdir -p "$OUT/frames/desktop" "$OUT/frames/mobile" "$OUT/video"
rm -f "$OUT/frames/desktop/"*.webp "$OUT/frames/mobile/"*.webp

# 1) Normalise both clips to 1920x1080 @ 24fps and join. Clip 2 starts on the
#    frame Clip 1 ends on (KF2), so drop its first frame to avoid a stutter.
ffmpeg -y -loglevel error -i "$C1" -i "$C2" -filter_complex \
  "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,setsar=1,format=yuv420p[a]; \
   [1:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,setsar=1,format=yuv420p,trim=start_frame=1,setpts=PTS-STARTPTS[b]; \
   [a][b]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -c:v libx264 -crf 14 -preset slow "$TMP/joined.mp4"

# 2) Frame sets
ffmpeg -y -loglevel error -i "$TMP/joined.mp4" -c:v libwebp -quality "$Q" -compression_level 6 \
  "$OUT/frames/desktop/f_%04d.webp"
ffmpeg -y -loglevel error -i "$TMP/joined.mp4" \
  -vf "transpose=1,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libwebp -quality "$((Q - 4))" -compression_level 6 "$OUT/frames/mobile/f_%04d.webp"

# 3) Posters + all-keyframe fallback video
ffmpeg -y -loglevel error -i "$TMP/joined.mp4" -vframes 1 -q:v 3 "$OUT/video/poster-start.jpg"
ffmpeg -y -loglevel error -i "$TMP/joined.mp4" -vf "transpose=1,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -vframes 1 -q:v 3 "$OUT/video/poster-start-mobile.jpg"
ffmpeg -y -loglevel error -i "$TMP/joined.mp4" -vf "scale=1280:-2" -c:v libx264 -crf 24 -g 1 \
  -pix_fmt yuv420p -movflags +faststart -an "$OUT/video/hero-scrub.mp4"

# 4) Manifest (the engine reads counts from here, so config can't drift from disk)
DC=$(ls "$OUT/frames/desktop" | wc -l | tr -d ' ')
MC=$(ls "$OUT/frames/mobile" | wc -l | tr -d ' ')
DS=$(du -sk "$OUT/frames/desktop" | cut -f1)
MS=$(du -sk "$OUT/frames/mobile" | cut -f1)
cat > "$OUT/frames/manifest.json" <<JSON
{
  "version": 1,
  "desktop": { "count": $DC, "width": 1920, "height": 1080, "path": "/frames/desktop/f_", "ext": ".webp", "pad": 4, "kb": $DS },
  "mobile": { "count": $MC, "width": 720, "height": 1280, "path": "/frames/mobile/f_", "ext": ".webp", "pad": 4, "kb": $MS }
}
JSON
rm -rf "$TMP"
echo "desktop: $DC frames, ${DS} KB   mobile: $MC frames, ${MS} KB"
