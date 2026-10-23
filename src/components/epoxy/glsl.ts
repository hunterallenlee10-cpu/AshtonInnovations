// Shaders for the epoxy pour. Kept as plain strings so three.js can compile
// them directly; the surface is a full-screen quad in clip space.

export const EPOXY_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const EPOXY_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uFlow;     // follows scroll position
uniform float uSettle;   // 0 = flowing, 1 = settled mirror finish
uniform float uFlakeT;   // 0..1 chips landing
uniform float uAspect;
uniform float uResY;     // drawing-buffer height in px
uniform vec2 uMouse;     // 0..1
uniform vec3 uW;         // finish weights: solid, flake, metallic
uniform vec4 uRipples[8];// xy = uv, z = age (s), w = strength
uniform sampler2D uMetal;
uniform sampler2D uSolid;
uniform sampler2D uFlake;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float box(vec2 x, vec2 c, vec2 s, float blur) {
  vec2 d = abs(x - c) - s;
  return 1.0 - smoothstep(-blur, blur, max(d.x, d.y));
}

// A fake room reflected in the floor: soft gradient, two windows, a cove line.
vec3 env(vec2 x, float blur) {
  vec3 c = mix(vec3(0.018, 0.018, 0.02), vec3(0.15, 0.15, 0.16), smoothstep(-0.2, 1.25, x.y));
  float w = box(x, vec2(0.26 * uAspect, 0.78), vec2(0.07, 0.17), blur);
  w += 0.8 * box(x, vec2(0.74 * uAspect, 0.8), vec2(0.06, 0.13), blur);
  float cove = box(x, vec2(0.5 * uAspect, 0.97), vec2(0.42 * uAspect, 0.012), blur * 0.6);
  return c + vec3(0.72, 0.71, 0.68) * w + vec3(1.0, 0.82, 0.6) * cove * 0.45;
}

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float settle = uSettle;

  // Domain-warped flow. Fast and deep while pouring, nearly still once settled.
  float t = uTime * mix(0.05, 0.012, settle) + uFlow * 1.4;
  float amp = mix(1.15, 0.16, settle);
  vec2 q = vec2(fbm(p * 1.25 + vec2(0.0, t)), fbm(p * 1.25 + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(
    fbm(p * 1.25 + 3.2 * q + vec2(1.7, 9.2) + 0.7 * t),
    fbm(p * 1.25 + 3.2 * q + vec2(8.3, 2.8) - 0.6 * t)
  );
  vec2 warp = (r - 0.5) * amp;
  float h = fbm(p * 1.8 + 2.4 * r);

  // Cursor ripples
  vec2 rg = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 R = uRipples[i];
    if (R.w <= 0.0) continue;
    vec2 d = p - vec2(R.x * uAspect, R.y);
    float dist = length(d) + 1e-4;
    float k = R.w * exp(-R.z * 2.4) * exp(-dist * 13.0);
    rg += (d / dist) * cos(dist * 70.0 - R.z * 9.0) * k;
  }

  // Surface normal from the height field (screen-space derivatives)
  vec2 grad = vec2(dFdx(h), dFdy(h)) * uResY;
  // Metallic keeps the poured relief; solid and flake read as flat satin coats.
  float relief = mix(0.18, 1.0, uW.z);
  float nS = mix(1.4, 0.12, settle) * relief;
  vec3 n = normalize(vec3(-grad * 0.1 * nS - rg * mix(0.06, 0.14, settle), 1.0));

  // Finishes
  vec2 tuv = p * 0.62 + warp * 0.38 + vec2(0.0, uFlow * 0.2);
  vec3 metal = texture2D(uMetal, tuv).rgb;
  vec3 solid = texture2D(uSolid, p * 1.4 + warp * 0.02).rgb;
  vec2 fuv = p * 1.1 + warp * 0.02;
  vec3 flakeTex = texture2D(uFlake, fuv).rgb;
  float cell = hash(floor(fuv * 42.0));
  float land = smoothstep(cell, cell + 0.06, uFlakeT * 1.06);
  vec3 flake = mix(solid, flakeTex, land);
  vec3 base = solid * uW.x + flake * uW.y + metal * uW.z;

  // Light follows the cursor
  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  vec3 L = normalize(vec3(m - p, 0.9));
  vec3 V = vec3(0.0, 0.0, 1.0);
  float diff = 0.72 + 0.28 * max(dot(n, L), 0.0);
  float satin = uW.x + 0.6 * uW.y;
  float rv = max(dot(reflect(-L, n), V), 0.0);
  // a soft sheen under the light plus a small glint; satin coats get less of both
  float sheen = pow(rv, 10.0) * 0.1;
  float glint = pow(rv, mix(60.0, 240.0, settle)) * mix(0.16, 0.38, settle);
  float spec = (sheen + glint) * mix(1.0, 0.4, satin);
  vec3 R = reflect(-V, n);
  vec3 e = env(p + R.xy * mix(0.9, 0.35, settle), mix(0.05, 0.006, settle) * (1.0 + 2.5 * satin));
  float refl = mix(0.08, 0.4, settle) * (0.45 * uW.x + 0.55 * uW.y + uW.z);

  vec3 col = base * diff + e * refl + vec3(1.0, 0.97, 0.92) * spec;

  // One thin crimson vein, metallic only
  float v = fbm(p * 0.85 + warp * 0.55 + vec2(11.0, 3.0));
  float line = 1.0 - smoothstep(0.0, mix(0.0055, 0.0032, settle), abs(v - 0.5));
  col = mix(col, vec3(0.6, 0.04, 0.1), line * 0.7 * uW.z);

  float vig = smoothstep(1.25, 0.25, length((vUv - 0.5) * vec2(1.0, 1.15)) * 1.5);
  col *= mix(0.45, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;
