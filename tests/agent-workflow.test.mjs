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
