// Screenshot QA: node scripts/qa.mjs <baseUrl> <outDir> [mode]
// mode: hero (default) | full | epoxy | reduced
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "qa";
const mode = process.argv[4] ?? "hero";
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch();
const errors = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.hasTouch ?? false,
    reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${vp.name}] pageerror: ${e.message}`));
  const q = mode === "epoxy" && vp.name === "desktop" ? "/?epoxy=webgl" : "/";
  await page.goto(base + (mode === "contact" ? "/contact" : q), { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);

  const heroAt = async (p, tag) => {
    await page.evaluate((p) => {
      const t = document.querySelector(".hero-track");
      const y = t.getBoundingClientRect().top + window.scrollY + p * (t.offsetHeight - window.innerHeight);
      window.scrollTo(0, y);
    }, p);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${vp.name}-${tag}.png` });
  };

  if (mode === "hero" || mode === "reduced") {
    await page.screenshot({ path: `${out}/${vp.name}-hero-00.png` });
    if (mode === "hero") {
      await heroAt(0.12, "hero-12");
      await heroAt(0.4, "hero-40");
      await heroAt(0.7, "hero-70");
      await heroAt(0.9, "hero-90");
      await heroAt(0.99, "hero-99");
    }
  }
  if (mode === "full" || mode === "reduced" || mode === "contact") {
    // walk the page; pinned sections (inside a GSAP pin-spacer) get start/middle/end shots
    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll("main section[id], footer[id]"))
        .filter((s) => !s.closest("section[id] section[id]"))
        .map((s) => s.id),
    );
    for (const id of ids) {
      const stops = await page.evaluate((id) => {
        const el = document.getElementById(id);
        const sp = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : null;
        const top = (sp ?? el).getBoundingClientRect().top + window.scrollY;
        if (!sp) return [top];
        const range = sp.offsetHeight - window.innerHeight;
        return [top, top + range * 0.5, top + range];
      }, id);
      for (let k = 0; k < stops.length; k++) {
        await page.evaluate((y) => window.scrollTo(0, y), stops[k]);
        await page.waitForTimeout(1700);
        await page.screenshot({ path: `${out}/${vp.name}-sec-${id}${stops.length > 1 ? "-" + k : ""}.png` });
      }
    }
  }
  if (mode === "epoxy") {
    const pourTop = async (p) =>
      page.evaluate((p) => {
        const panel = document.querySelector('#epoxy [role="tabpanel"]');
        const host = panel.parentElement;
        const sp = host.parentElement?.classList.contains("pin-spacer") ? host.parentElement : host;
        const top = sp.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + p * Math.max(0, sp.offsetHeight - window.innerHeight));
      }, p);
    await page.evaluate(() => {
      const el = document.getElementById("epoxy");
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${out}/${vp.name}-epoxy-top.png` });
    await page.evaluate(() => {
      const el = document.getElementById("epoxy");
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.4);
    });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/${vp.name}-epoxy-lookdown.png` });
    await pourTop(0.05);
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${out}/${vp.name}-epoxy-pour-start.png` });
    await pourTop(0.98);
    await page.waitForTimeout(2500);
    for (const f of ["metallic", "solid", "flake"]) {
      await page.click(`#finish-tab-${f}`);
      await page.waitForTimeout(f === "flake" ? 2600 : 1800);
      await page.mouse.move(vp.width * 0.6, vp.height * 0.4);
      await page.mouse.move(vp.width * 0.7, vp.height * 0.5, { steps: 8 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${out}/${vp.name}-epoxy-tab-${f}.png` });
    }
    await page.evaluate(() => {
      const slots = document.querySelector("#epoxy").lastElementChild;
      window.scrollTo(0, slots.getBoundingClientRect().top + window.scrollY - 80);
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${vp.name}-epoxy-after.png` });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) errors.push(`[${vp.name}] horizontal overflow: ${overflow}px`);
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${out}/console.txt`, errors.join("\n") || "no console errors");
console.log(errors.length ? errors.join("\n") : "no console errors");
