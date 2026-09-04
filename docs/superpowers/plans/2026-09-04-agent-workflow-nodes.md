# Agent Workflow Nodes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three readable Agent capability nodes beside the existing homepage sphere without changing other pages.

**Architecture:** A static Astro component owns only the node overlay, decorative SVG connectors, CSS motion and caption. The existing page retains its sphere, orbital animation and pointer handling inside a square visual wrapper; the overlay is its non-rotating sibling. CSS makes the overlay flow below the square on mobile.

**Tech Stack:** Existing Astro, scoped CSS, inline SVG diagram paths; Node built-in test runner. No new packages, server endpoints or client scripts.

---

Approved specification: `docs/superpowers/specs/2026-09-04-agent-workflow-nodes-design.md`.
Execute inline on the existing feature branch; do not create an unrequested workspace or change hosting platforms.

## Files

- Create `src/components/AgentWorkflow.astro`: node labels, three connectors, motion, caption and mobile/reduced-motion styles.
- Modify `src/pages/index.astro`: import overlay; separate square visual from non-rotating overlay; expose one accessible figure description; remove old caption styles.
- Create `tests/agent-workflow.test.mjs`: generated-page contract and motion/layout source checks; these are not browser visual tests.
- Update the specification status after implementation and record verification results here.

## Task 1 — Establish red tests

- [x] Run `npx astro check` and `npx astro build` on the clean baseline. Both must exit 0.
- [x] Create `tests/agent-workflow.test.mjs` with the following complete test code:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const hero = html.match(/<section\b[^>]*\bdata-hero(?:\s|>)[\s\S]*?<\/section>/)?.[0] ?? '';
const componentPath = new URL('../src/components/AgentWorkflow.astro', import.meta.url);
const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : '';

test('the static homepage renders exactly three named capability nodes', () => {
  const nodes = [...hero.matchAll(/data-workflow-node="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)];
  assert.deepEqual(nodes.map((node) => node[1]), ['planning', 'tools', 'verification']);
  assert.deepEqual(nodes.map((node) => node[2].trim()), ['Planning', 'Tools', 'Verification']);
});

test('the sphere has one accessible description without implying live monitoring', () => {
  const scene = hero.match(/<div\b[^>]*\bdata-core(?:\s|>)[^>]*>/)?.[0] ?? '';
  assert.match(scene, /role="img"/);
  assert.match(scene, /aria-label="Agent 工作流示意：任务规划、工具调用和结果验证。"/);
  assert.doesNotMatch(scene, /aria-hidden="true"/);
  assert.doesNotMatch(hero, /runtime verified|aria-live=/);
  assert.match(hero, />Agent workflow<\/p>/);
});

test('the overlay is decorative and introduces no actions or client runtime', () => {
  assert.match(hero, /data-agent-workflow[^>]*aria-hidden="true"/);
  assert.match(component, /pointer-events:\s*none/);
  assert.doesNotMatch(component, /<(?:button|a|script)\b|tabindex=|client:/);
});

test('labels live outside the tilted sphere system and the existing sphere remains', () => {
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /<div class="core-visual" aria-hidden="true">/);
  assert.match(page, /<\/div>\s*<\/div>\s*<AgentWorkflow\s*\/>/);
  assert.match(hero, /class="core-sphere/);
  assert.match(hero, />AGENT<\/span>/);
});

test('mobile layout wraps below the square visual and hides the connectors', () => {
  assert.match(component, /@media\s*\(max-width:\s*700px\)[\s\S]*?\.workflow-overlay\s*\{[^}]*position:\s*relative/);
  assert.match(component, /\.workflow-nodes\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(component, /@media\s*\(max-width:\s*700px\)[\s\S]*?\.workflow-links\s*\{[^}]*display:\s*none/);
});

test('reduced motion suppresses signals and label animation while retaining static labels', () => {
  const reduced = component.slice(component.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /\.workflow-signal\s*\{[^}]*display:\s*none/);
  assert.match(reduced, /\.workflow-node::after\s*\{[^}]*animation:\s*none/);
  assert.doesNotMatch(reduced, /\.workflow-node\s*\{[^}]*display:\s*none/);
});

```

- [x] Run `node --test tests/agent-workflow.test.mjs`. Expect assertions to fail because the current homepage has no capability nodes, no accessible figure label and the old caption.

## Task 2 — Implement the static overlay and motion

- [x] Create the overlay component with three records: planning / Planning / delay 0s; tools / Tools / delay 3s; verification / Verification / delay 6s. Use these connector paths in a 400-square SVG:

```js
const nodes = [
  { id: 'planning', label: 'Planning', path: 'M 70 94 H 124 Q 140 94 148 110 L 170 150', delay: '0s' },
  { id: 'tools', label: 'Tools', path: 'M 350 190 H 274', delay: '3s' },
  { id: 'verification', label: 'Verification', path: 'M 90 308 H 131 Q 146 308 154 291 L 174 253', delay: '6s' },
];
```

Render an `aria-hidden="true"`, `data-agent-workflow` overlay, SVG decorative paths and pulses using each record, fixed non-interactive spans with `data-workflow-node`, and a paragraph `Agent workflow`. Label positions: planning left 0/top 18%; tools right 0/top 43%; verification left 2%/top 72%. Keep paths underneath dark opaque pills so no line is visible through text.

- [x] Use a nine-second, staggered loop. Base paths stay dim. Signals use `pathLength="100"`, `stroke-dasharray: 1 100` and round line caps. Use this timeline:

```css
@keyframes workflow-signal {
  0% { opacity: 0; stroke-dashoffset: 2; }
  3% { opacity: .85; }
  24% { opacity: .85; }
  28%, 100% { opacity: 0; stroke-dashoffset: -100; }
}
@keyframes workflow-highlight {
  0%, 30%, 100% { opacity: 0; }
  7%, 20% { opacity: .8; }
}
@media (max-width: 700px) {
  .workflow-overlay { position: relative; padding-top: .5rem; }
  .workflow-links { display: none; }
  .workflow-nodes { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; }
  .workflow-node { position: relative; inset: auto; }
  .workflow-node::after { animation: none; opacity: 0; }
  .workflow-caption { position: static; margin: 1rem 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .workflow-signal { display: none; animation: none; }
  .workflow-node::after { animation: none; opacity: 0; }
}
```

Pills: 14px-equivalent rem text, subtle blue-white border, dark background, no rotation/translation animation. Animate only the pill outline pseudo-element opacity. Caption: 12px-equivalent rem, static pale-blue dot.

- [x] Import the component in the homepage and use this shape:

```astro
<div class="core-scene" data-core role="img" aria-label="Agent 工作流示意：任务规划、工具调用和结果验证。">
  <div class="core-visual" aria-hidden="true">
    <!-- Existing core-shadow and core-system (sphere + orbits), without core-status. -->
  </div>
  <AgentWorkflow />
</div>
```

Move `aspect-ratio: 1` and `perspective: 1000px` from `.core-scene` onto `.core-visual { position: relative; width: 100%; }`. Keep all sphere/scroll/pointer animation code. Remove only `.core-status`, `.core-status b` and its unused `status-pulse` keyframes.

- [x] Start `npx astro dev --background`, make one HEAD request to the printed URL, then show that preview. Do not run browser interaction or screenshot testing without a user request.
- [x] Run `npx astro build`, then `node --test tests/agent-workflow.test.mjs`. Expect six passing tests.

## Task 3 — Verify, review and publish

- [x] Run `npx astro check`, `npx astro build`, `node --test tests/agent-workflow.test.mjs` and `git diff --check`. Require successful exits.
- [x] Review changed files against the approved specification: unchanged sphere, fixed labels, mobile flow, no runtime claim, no scripts/dependencies and static reduced-motion fallback.
- [x] Update specification status and record actual checks, distinguishing source/output checks from unperformed browser visual checks.
- [ ] Commit only the scoped files. Preserve other user changes.
- [ ] Publish through the existing GitHub master → Vercel integration, applying only the verified changed files with an expected remote HEAD guard.
- [ ] Confirm the Vercel commit status reaches success; report a failure honestly if it does not.
- [ ] Stop the background dev server after publishing. Return the existing site URL, changes and any verification limitations.

## Self-review

All six specification acceptance points map to Tasks 2–3. No additional features, dependencies, live statuses, hosted services or site migrations are introduced. The visual wrapper is required to prevent mobile caption height from stretching the sphere. CSS contract checks do not claim pixel-level visual verification.

## Verification record

- Baseline: Astro check (20 files), zero errors/warnings; static production build passed.
- Red: all six new tests failed for missing nodes, accessible description, overlay and responsive/motion rules.
- Green: production build and all six tests passed after implementing the component and wrapper.
- Final source verification: Astro check (22 files), zero errors/warnings; production build produced 11 pages; all six tests and diff whitespace check passed.
- Local preview: HEAD http://localhost:4321/ returned 200; preview handoff was queued by the app.
- Remote preflight: the previous homepage source equals the local base after CRLF normalization; differing blob hashes reflect line endings only.
- Independent source review: no actionable findings; approved for publishing based on source-level review.
- Limits: no browser screenshots, resizing, interaction, actual assistive-technology or pixel-level animation checks performed. Responsive and reduced-motion assertions are source-level checks, not visual acceptance.
