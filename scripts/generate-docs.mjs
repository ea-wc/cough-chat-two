// Generates the OpenSpec/Prisma-derived VitePress pages.
// Authored pages (index, context, c4-*, api) are never touched.
//
//   node scripts/generate-docs.mjs
//
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const SPECS = join(ROOT, 'openspec', 'specs');
const PRISMA = join(ROOT, 'apps', 'api', 'prisma', 'schema.prisma');

function write(relPath, content) {
  const p = join(DOCS, relPath);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log('  wrote', relPath);
}

// --- OpenSpec specs -> features + per-module overview ---
function parseSpec(path) {
  const raw = readFileSync(path, 'utf8');
  const purpose = raw.match(/## Purpose\s*\n([\s\S]*?)(?=\n## Requirements)/)?.[1]?.trim() ?? '';
  const requirements = [...raw.matchAll(/^### Requirement:\s*(.+)$/gm)].map((m) => m[1].trim());
  return { purpose, requirements };
}

function generateFromSpecs() {
  const caps = readdirSync(SPECS)
    .filter((d) => !d.startsWith('.'))
    .map((dir) => {
      const specPath = join(SPECS, dir, 'spec.md');
      const { purpose, requirements } = parseSpec(specPath);
      return { name: dir, purpose, requirements };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Features overview
  const featureRows = caps
    .map((c) => `| \`${c.name}\` | ${c.purpose.replace(/\n/g, ' ')} | ${c.requirements.length} |`)
    .join('\n');
  write(
    'overview/features.md',
    `# Features

The system is decomposed into **${caps.length} capabilities**, each backed by an OpenSpec capability spec
(\`openspec/specs/<capability>/spec.md\`) and a NestJS module.

> This page is generated from \`openspec/specs/\`. Regenerate with \`pnpm docs:generate\`.

| Capability | Purpose | Requirements |
| --- | --- | --- |
${featureRows}
`,
  );

  // Per-module pages
  for (const c of caps) {
    const reqList = c.requirements.map((r) => `- ${r}`).join('\n') || '- _(no requirements)_';
    write(
      `modules/${c.name}.md`,
      `# ${c.name}

## Module overview

${c.purpose}

> This page is generated from \`openspec/specs/${c.name}/spec.md\`. Regenerate with \`pnpm docs:generate\`.

## Requirements

${reqList}

## Data model

See [Data model](/architecture/data-model) for the full entity-relationship diagram.
`,
    );
  }

  return caps;
}

// --- Prisma schema -> Mermaid ERD ---
function generateDataModel() {
  const schema = readFileSync(PRISMA, 'utf8');

  const models = [];
  const modelRe = /^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let m;
  while ((m = modelRe.exec(schema)) !== null) {
    const name = m[1];
    const fields = [];
    for (const line of m[2].split('\n')) {
      const fm = line.match(/^\s*(\w+)\s+([\w?\[\]]+)/);
      if (!fm) continue;
      const [, fieldName, fieldType] = fm;
      // A field is the "FK side" of a relation when it declares @relation(fields: ...).
      const isFk = /@relation\([^)]*\bfields\s*:/.test(line);
      fields.push({ name: fieldName, type: fieldType, isFk });
    }
    models.push({ name, fields });
  }

  const rels = [];
  for (const { name, fields } of models) {
    for (const f of fields) {
      const typeName = f.type.replace(/[?\[\]]/g, '');
      const isModel = models.some((mm) => mm.name === typeName);
      if (isModel && f.isFk) {
        rels.push(`${name} ||--o{ ${typeName} : "${f.name}"`);
      }
    }
  }

  const entityBlocks = models
    .map(({ name, fields }) => {
      const body = fields
        .filter((f) => !models.some((mm) => mm.name === f.type.replace(/[?\[\]]/g, '')))
        .map((f) => `        ${f.type.replace(/[?\[\]]/g, '')} ${f.name}`)
        .join('\n');
      return `    ${name} {\n${body}\n    }`;
    })
    .join('\n');

  write(
    'architecture/data-model.md',
    `# Data model

The PostgreSQL schema is defined in \`apps/api/prisma/schema.prisma\` and accessed via Prisma ORM.

> This page is generated from the Prisma schema. Regenerate with \`pnpm docs:generate\`.

\`\`\`mermaid
erDiagram
${entityBlocks}

${rels.map((r) => `    ${r}`).join('\n')}
\`\`\`
`,
  );
}

console.log('Generating docs from OpenSpec specs + Prisma schema…');
generateFromSpecs();
generateDataModel();
console.log('Done.');
