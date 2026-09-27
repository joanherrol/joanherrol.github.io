// Compiles rules/*.md into AGENTS.md, ordered by rules/_sections.md.
// Run: node scripts/build-agents.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rulesDir = join(root, "rules");
const sectionsSrc = readFileSync(join(rulesDir, "_sections.md"), "utf8");

const sections = [...sectionsSrc.matchAll(
  /## (\d+)\. (.+?) \((\w+)\)\n\n\*\*Impact:\*\* (.+)\n\*\*Description:\*\* (.+)\n\*\*Rules:\*\* (.+)/g,
)].map(([, n, name, prefix, impact, description, rules]) => ({
  n, name, prefix, impact, description,
  order: rules.split(",").map((r) => `${prefix}-${r.trim()}.md`),
}));

const files = readdirSync(rulesDir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

function parse(file) {
  const src = readFileSync(join(rulesDir, file), "utf8");
  const [, front, body] = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(
    front.split("\n").map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).trim()]),
  );
  return { file, ...meta, body: body.trim() };
}

let toc = "";
let out = "";
for (const s of sections) {
  const unlisted = files.filter((f) => f.startsWith(`${s.prefix}-`) && !s.order.includes(f));
  if (unlisted.length) throw new Error(`Add to _sections.md Rules: ${unlisted.join(", ")}`);
  const rules = s.order.map(parse);
  toc += `${s.n}. [${s.name}](#${s.n}-${s.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/ +/g, "-")}) — **${s.impact}**\n`;
  out += `## ${s.n}. ${s.name}\n\n**Impact: ${s.impact}**\n\n${s.description}\n\n`;
  rules.forEach((r, i) => {
    const id = `${s.n}.${i + 1}`;
    toc += `   - ${id} [${r.title}](#${id.replace(".", "")}-${r.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/ +/g, "-")})\n`;
    out += `### ${id} ${r.title}\n\n**Impact: ${r.impact} (${r.impactDescription})**\n\n`;
    out += `${r.body.replace(/^## .*\n+/, "")}\n\n`;
  });
  out += "---\n\n";
}

const header = `# PICO-8 Pixel UI

**Version 1.0.0**

> **Note:**
> This document is for agents and LLMs to follow when building, maintaining or refactoring a PICO-8-style pixel UI and its game layer.
> It is compiled from \`rules/\` by \`scripts/build-agents.mjs\`; edit the rules, not this file.

---

## Abstract

A strict design system for flat pixel-art web UIs that sit alongside PICO-8-style game characters, plus the techniques for animating those characters, their shadows, shots and collisions on a web page. It holds ${files.length} rules across ${sections.length} categories, ordered by impact from critical (the pixel grid, colour, shadows and layers) to supporting (performance and tooling). Each rule explains why it matters and shows incorrect and correct code. The reference implementation is a Next.js 16, React 19 and Tailwind CSS v4 portfolio; \`templates/\` holds its core files.

---

## Table of Contents

`;
writeFileSync(join(root, "AGENTS.md"), `${header}${toc}\n---\n\n${out}`.trimEnd() + "\n");
console.log(`AGENTS.md: ${files.length} rules in ${sections.length} sections`);
