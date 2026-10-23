import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const b = await chromium.launch();
for (const w of [375, 768, 1280, 1920]) {
  for (const path of ["/", "/contact"]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto("http://localhost:3100" + path, { waitUntil: "networkidle" });
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    let worst = 0;
    for (let y = 0; y < total; y += 700) {
      await p.evaluate((y) => window.scrollTo(0, y), y);
      await p.waitForTimeout(120);
      worst = Math.max(worst, await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
    }
    // tap targets smaller than 44px (visible interactive elements)
    const small = await p.evaluate(() =>
      Array.from(document.querySelectorAll("a[href], button, input, select, textarea, [role=tab]"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || r.width === 0) return false;
          if (el.matches("input[type=radio], input[type=checkbox]")) return false;
          return r.height < 44 && r.width < 44;
        })
        .map((el) => (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30)),
    );
    console.log(`${w} ${path}: overflow ${worst}px, small targets: ${small.length ? small.join(" | ") : "none"}`);
    await p.close();
  }
}
await b.close();
