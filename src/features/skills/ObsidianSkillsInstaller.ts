/**
 * Obsidian Skills Installer
 * 
 * Installs pre-bundled Obsidian skills to the vault's .claude/skills folder.
 */

import * as fs from 'fs';
import * as path from 'path';

import type { App } from 'obsidian';
import { Notice, requestUrl } from 'obsidian';

import { getVaultPath } from '../../utils/path';

/** Bundled skill files to install */
const OBSIDIAN_MARKDOWN_SKILL = `---
name: obsidian-markdown
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.
---

# Obsidian Flavored Markdown Skill

This skill enables skills-compatible agents to create and edit valid Obsidian Flavored Markdown, including all Obsidian-specific syntax extensions.

## Overview

Obsidian uses a combination of Markdown flavors:
- [CommonMark](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [LaTeX](https://www.latex-project.org/) for math
- Obsidian-specific extensions (wikilinks, callouts, embeds, etc.)

## Internal Links (Wikilinks)

\`\`\`markdown
[[Note Name]]
[[Note Name|Display Text]]
[[Note Name#Heading]]
[[Note Name#^block-id]]
\`\`\`

## Embeds

\`\`\`markdown
![[Note Name]]
![[image.png]]
![[image.png|300]]
![[document.pdf#page=3]]
\`\`\`

## Callouts

\`\`\`markdown
> [!note]
> This is a note callout.

> [!tip] Custom Title
> This callout has a custom title.

> [!warning]- Collapsed by default
> This content is hidden until expanded.
\`\`\`

### Supported Callout Types

| Type | Aliases |
|------|---------|
| \`note\` | - |
| \`abstract\` | \`summary\`, \`tldr\` |
| \`info\` | - |
| \`todo\` | - |
| \`tip\` | \`hint\`, \`important\` |
| \`success\` | \`check\`, \`done\` |
| \`question\` | \`help\`, \`faq\` |
| \`warning\` | \`caution\`, \`attention\` |
| \`failure\` | \`fail\`, \`missing\` |
| \`danger\` | \`error\` |
| \`bug\` | - |
| \`example\` | - |
| \`quote\` | \`cite\` |

## Task Lists

\`\`\`markdown
- [ ] Incomplete task
- [x] Completed task
\`\`\`

## Properties (Frontmatter)

\`\`\`yaml
---
title: My Note Title
date: 2024-01-15
tags:
  - project
  - important
aliases:
  - My Note
---
\`\`\`

## Tags

\`\`\`markdown
#tag
#nested/tag
#tag-with-dashes
\`\`\`

## Math (LaTeX)

\`\`\`markdown
Inline: $e^{i\\pi} + 1 = 0$

Block:
$$
\\frac{a}{b}
$$
\`\`\`

## Diagrams (Mermaid)

\`\`\`\`markdown
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do this]
    B -->|No| D[Do that]
\`\`\`
\`\`\`\`

## Comments

\`\`\`markdown
This is visible %%but this is hidden%% text.
\`\`\`

## References

- [Basic formatting syntax](https://help.obsidian.md/syntax)
- [Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)
- [Internal links](https://help.obsidian.md/links)
- [Callouts](https://help.obsidian.md/callouts)
- [Properties](https://help.obsidian.md/properties)
`;

const JSON_CANVAS_SKILL = `---
name: json-canvas
description: Create and edit JSON Canvas files (.canvas) for visual note-taking and mind mapping in Obsidian. Use when the user wants to create visual diagrams, mind maps, or canvas views.
---

# JSON Canvas Skill

JSON Canvas is an open file format for infinite canvas tools. Obsidian uses this format for .canvas files.

## File Structure

\`\`\`json
{
  "nodes": [],
  "edges": []
}
\`\`\`

## Node Types

### Text Node
\`\`\`json
{
  "id": "unique-id",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 250,
  "height": 60,
  "text": "Your text content here"
}
\`\`\`

### File Node
\`\`\`json
{
  "id": "unique-id",
  "type": "file",
  "x": 300,
  "y": 0,
  "width": 400,
  "height": 400,
  "file": "path/to/note.md"
}
\`\`\`

### Link Node
\`\`\`json
{
  "id": "unique-id",
  "type": "link",
  "x": 0,
  "y": 200,
  "width": 400,
  "height": 300,
  "url": "https://example.com"
}
\`\`\`

### Group Node
\`\`\`json
{
  "id": "unique-id",
  "type": "group",
  "x": -50,
  "y": -50,
  "width": 500,
  "height": 400,
  "label": "Group Label"
}
\`\`\`

## Edges (Connections)

\`\`\`json
{
  "id": "edge-id",
  "fromNode": "node-id-1",
  "toNode": "node-id-2",
  "fromSide": "right",
  "toSide": "left",
  "label": "Connection label"
}
\`\`\`

### Side Values
- \`top\`, \`right\`, \`bottom\`, \`left\`

## Node Colors

Use the \`color\` property with values: \`1\`-\`6\` (preset colors) or hex codes.

\`\`\`json
{
  "id": "colored-node",
  "type": "text",
  "color": "1",
  "text": "Red node"
}
\`\`\`

## Complete Example

\`\`\`json
{
  "nodes": [
    {
      "id": "main",
      "type": "text",
      "x": 0,
      "y": 0,
      "width": 200,
      "height": 60,
      "text": "Main Idea",
      "color": "1"
    },
    {
      "id": "sub1",
      "type": "text",
      "x": 300,
      "y": -80,
      "width": 150,
      "height": 50,
      "text": "Sub-topic 1"
    },
    {
      "id": "sub2",
      "type": "text",
      "x": 300,
      "y": 80,
      "width": 150,
      "height": 50,
      "text": "Sub-topic 2"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "fromNode": "main",
      "toNode": "sub1",
      "fromSide": "right",
      "toSide": "left"
    },
    {
      "id": "e2",
      "fromNode": "main",
      "toNode": "sub2",
      "fromSide": "right",
      "toSide": "left"
    }
  ]
}
\`\`\`

## References

- [JSON Canvas Specification](https://jsoncanvas.org/)
- [Obsidian Canvas Documentation](https://help.obsidian.md/Plugins/Canvas)
`;

/** Check if obsidian skills are already installed */
export function isObsidianSkillsInstalled(app: App): boolean {
  const vaultPath = getVaultPath(app);
  if (!vaultPath) return false;

  const skillsPath = path.join(vaultPath, '.claude', 'skills', 'obsidian-markdown');
  return fs.existsSync(skillsPath);
}

/** Install obsidian skills to the vault */
export async function installObsidianSkills(app: App): Promise<boolean> {
  const vaultPath = getVaultPath(app);
  if (!vaultPath) {
    new Notice('Could not determine vault path');
    return false;
  }

  try {
    // Create directories
    const skillsBasePath = path.join(vaultPath, '.claude', 'skills');
    const obsidianMarkdownPath = path.join(skillsBasePath, 'obsidian-markdown');
    const jsonCanvasPath = path.join(skillsBasePath, 'json-canvas');

    // Create skill directories
    fs.mkdirSync(obsidianMarkdownPath, { recursive: true });
    fs.mkdirSync(jsonCanvasPath, { recursive: true });

    // Write skill files
    fs.writeFileSync(
      path.join(obsidianMarkdownPath, 'SKILL.md'),
      OBSIDIAN_MARKDOWN_SKILL,
      'utf-8'
    );

    fs.writeFileSync(
      path.join(jsonCanvasPath, 'SKILL.md'),
      JSON_CANVAS_SKILL,
      'utf-8'
    );

    new Notice('✅ Obsidian Skills installed successfully!');
    return true;
  } catch (error) {
    console.error('Failed to install Obsidian Skills:', error);
    new Notice(`Failed to install skills: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/** Uninstall obsidian skills from the vault */
export async function uninstallObsidianSkills(app: App): Promise<boolean> {
  const vaultPath = getVaultPath(app);
  if (!vaultPath) {
    new Notice('Could not determine vault path');
    return false;
  }

  try {
    const skillsBasePath = path.join(vaultPath, '.claude', 'skills');
    const obsidianMarkdownPath = path.join(skillsBasePath, 'obsidian-markdown');
    const jsonCanvasPath = path.join(skillsBasePath, 'json-canvas');

    // Remove skill directories
    if (fs.existsSync(obsidianMarkdownPath)) {
      fs.rmSync(obsidianMarkdownPath, { recursive: true });
    }
    if (fs.existsSync(jsonCanvasPath)) {
      fs.rmSync(jsonCanvasPath, { recursive: true });
    }

    new Notice('Obsidian Skills removed');
    return true;
  } catch (error) {
    console.error('Failed to uninstall Obsidian Skills:', error);
    new Notice(`Failed to remove skills: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/** Install a skill from a GitHub URL */
export async function installSkillFromUrl(app: App, url: string): Promise<boolean> {
  const vaultPath = getVaultPath(app);
  if (!vaultPath) {
    new Notice('Could not determine vault path');
    return false;
  }

  try {
    let rawUrl = url;

    // Convert GitHub blob/repo URLs to raw.githubusercontent.com
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      // Handle: https://github.com/user/repo/blob/branch/file.md
      if (url.includes('/blob/')) {
        rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      // Handle: https://github.com/user/repo/tree/branch/path (folder URL)
      else if (url.includes('/tree/')) {
        rawUrl = url
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/tree/', '/');
        // If URL doesn't end with .md, assume it's a folder and add SKILL.md
        if (!rawUrl.toLowerCase().endsWith('.md')) {
          rawUrl = rawUrl.replace(/\/$/, '') + '/SKILL.md';
        }
      }
      // Handle: https://github.com/user/repo -> assume main/SKILL.md
      else {
        // Remove trailing slash if present
        const cleanUrl = url.replace(/\/$/, '');
        rawUrl = `${cleanUrl.replace('github.com', 'raw.githubusercontent.com')}/main/SKILL.md`;
      }
    }

    new Notice(`Downloading skill from ${rawUrl}...`);

    const response = await requestUrl({ url: rawUrl });

    if (response.status !== 200) {
      throw new Error(`Failed to download skill (Status: ${response.status}). Please check the URL.`);
    }

    const content = response.text;

    // Extract name from frontmatter
    const nameMatch = content.match(/^---\s*[\s\S]*?name:\s*([^\r\n]+)/);
    let skillName = '';

    if (nameMatch && nameMatch[1]) {
      skillName = nameMatch[1].trim();
    } else {
      // Fallback: try to derive from URL
      const urlParts = url.split('/');
      skillName = urlParts[urlParts.length - 1].replace(/\.md$/i, '') || 'unknown-skill';
    }

    // Sanitize name
    skillName = skillName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

    if (!skillName) {
      throw new Error('Could not determine skill name. Please ensure the SKILL.md has a "name" field in frontmatter.');
    }

    const skillsBasePath = path.join(vaultPath, '.claude', 'skills');
    const skillDir = path.join(skillsBasePath, skillName);

    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf-8');

    new Notice(`✅ Skill "${skillName}" installed successfully!`);
    return true;

  } catch (error) {
    console.error('Failed to install skill from URL:', error);
    new Notice(`Failed to install skill: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
