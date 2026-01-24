/**
 * SlashCommandStorage - Handles slash command files in vault/.claude/commands/
 * and global ~/.claude/commands/
 *
 * Each command is stored as a Markdown file with YAML frontmatter.
 * Supports nested folders for organization.
 * Vault commands take precedence over global commands with the same name.
 *
 * File format:
 * ```markdown
 * ---
 * description: Review code for issues
 * argument-hint: "[file] [focus]"
 * allowed-tools:
 *   - Read
 *   - Grep
 * model: claude-sonnet-4-5
 * ---
 * Your prompt content here with $ARGUMENTS placeholder
 * ```
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { parseSlashCommandContent } from '../../utils/slashCommand';
import type { ClaudeModel, SlashCommand } from '../types';
import type { VaultFileAdapter } from './VaultFileAdapter';

/** Path to commands folder relative to vault root. */
export const COMMANDS_PATH = '.claude/commands';

/** Path to global commands folder. */
export const GLOBAL_COMMANDS_PATH = path.join(os.homedir(), '.claude', 'commands');

/** Path to installed plugins JSON file. */
const INSTALLED_PLUGINS_PATH = path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json');

/** Structure of installed_plugins.json */
interface InstalledPluginsFile {
  version: number;
  plugins: Record<string, Array<{ installPath: string }>>;
}

export class SlashCommandStorage {
  constructor(private adapter: VaultFileAdapter) {}

  /**
   * Load all commands from plugins, global (~/.claude/commands/), and vault (.claude/commands/).
   * Priority: vault > global > plugins (vault overrides all)
   */
  async loadAll(): Promise<SlashCommand[]> {
    // Load plugin commands first (lowest priority)
    const pluginCommands = this.loadAllFromPlugins();

    // Load global commands
    const globalCommands = this.loadAllFromGlobal();

    // Load vault commands (highest priority)
    const vaultCommands: SlashCommand[] = [];
    try {
      const files = await this.adapter.listFilesRecursive(COMMANDS_PATH);

      for (const filePath of files) {
        if (!filePath.endsWith('.md')) continue;

        try {
          const command = await this.loadFromFile(filePath);
          if (command) {
            vaultCommands.push(command);
          }
        } catch (error) {
          console.error(`[ObsidianCode] Failed to load command from ${filePath}:`, error);
        }
      }
    } catch (error) {
      console.error('[ObsidianCode] Failed to list vault command files:', error);
    }

    // Merge with priority: vault > global > plugins
    const vaultNames = new Set(vaultCommands.map(c => c.name));
    const globalNames = new Set(globalCommands.map(c => c.name));

    const mergedCommands = [
      ...pluginCommands.filter((c: SlashCommand) => !globalNames.has(c.name) && !vaultNames.has(c.name)),
      ...globalCommands.filter((c: SlashCommand) => !vaultNames.has(c.name)),
      ...vaultCommands,
    ];

    return mergedCommands;
  }

  /**
   * Load commands from global ~/.claude/commands/ directory.
   * Uses Node.js fs module since this is outside the vault.
   */
  private loadAllFromGlobal(): SlashCommand[] {
    const commands: SlashCommand[] = [];

    if (!fs.existsSync(GLOBAL_COMMANDS_PATH)) {
      return commands;
    }

    try {
      const files = this.listFilesRecursiveSync(GLOBAL_COMMANDS_PATH);

      for (const filePath of files) {
        if (!filePath.endsWith('.md')) continue;

        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const relativePath = path.relative(GLOBAL_COMMANDS_PATH, filePath);
          const command = this.parseFileFromGlobal(content, relativePath);
          if (command) {
            commands.push(command);
          }
        } catch (error) {
          console.error(`[ObsidianCode] Failed to load global command from ${filePath}:`, error);
        }
      }
    } catch (error) {
      console.error('[ObsidianCode] Failed to list global command files:', error);
    }

    return commands;
  }

  /**
   * Load commands from installed Claude Code plugins.
   * Reads ~/.claude/plugins/installed_plugins.json and scans each plugin's commands/ folder.
   */
  private loadAllFromPlugins(): SlashCommand[] {
    const commands: SlashCommand[] = [];

    if (!fs.existsSync(INSTALLED_PLUGINS_PATH)) {
      return commands;
    }

    try {
      const content = fs.readFileSync(INSTALLED_PLUGINS_PATH, 'utf-8');
      const pluginsFile = JSON.parse(content) as InstalledPluginsFile;

      if (!pluginsFile.plugins || typeof pluginsFile.plugins !== 'object') {
        return commands;
      }

      // Iterate over all installed plugins
      for (const [pluginId, installations] of Object.entries(pluginsFile.plugins)) {
        if (!Array.isArray(installations) || installations.length === 0) continue;

        // Use the first installation (most plugins have only one)
        const installation = installations[0];
        if (!installation.installPath) continue;

        const commandsDir = path.join(installation.installPath, 'commands');
        if (!fs.existsSync(commandsDir)) continue;

        // Load all .md files from the plugin's commands folder
        const files = this.listFilesRecursiveSync(commandsDir);
        for (const filePath of files) {
          if (!filePath.endsWith('.md')) continue;

          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(commandsDir, filePath);
            const command = this.parseFileFromPlugin(fileContent, relativePath, pluginId);
            if (command) {
              commands.push(command);
            }
          } catch (error) {
            console.error(`[ObsidianCode] Failed to load plugin command from ${filePath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('[ObsidianCode] Failed to load plugin commands:', error);
    }

    return commands;
  }

  /**
   * Parse a command file from a plugin into a SlashCommand object.
   */
  private parseFileFromPlugin(content: string, relativePath: string, pluginId: string): SlashCommand {
    const parsed = parseSlashCommandContent(content);
    const name = relativePath.replace(/\.md$/, '');
    // Extract plugin name from pluginId (e.g., "bkit@bkit-marketplace" -> "bkit")
    const pluginName = pluginId.split('@')[0];
    const id = `plugin-${pluginName}-${name.replace(/-/g, '-_').replace(/\//g, '--')}`;

    return {
      id,
      name,
      description: parsed.description ? `[${pluginName}] ${parsed.description}` : `[${pluginName}]`,
      argumentHint: parsed.argumentHint,
      allowedTools: parsed.allowedTools,
      model: parsed.model as ClaudeModel | undefined,
      content: parsed.promptContent,
    };
  }

  /**
   * Recursively list all files in a directory (sync version for global path).
   */
  private listFilesRecursiveSync(dir: string): string[] {
    const files: string[] = [];

    const processDir = (currentDir: string) => {
      if (!fs.existsSync(currentDir)) return;

      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          processDir(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    };

    processDir(dir);
    return files;
  }

  /**
   * Parse a command file from global path into a SlashCommand object.
   */
  private parseFileFromGlobal(content: string, relativePath: string): SlashCommand {
    const parsed = parseSlashCommandContent(content);
    const name = relativePath.replace(/\.md$/, '');
    const id = `global-cmd-${name.replace(/-/g, '-_').replace(/\//g, '--')}`;

    return {
      id,
      name,
      description: parsed.description,
      argumentHint: parsed.argumentHint,
      allowedTools: parsed.allowedTools,
      model: parsed.model as ClaudeModel | undefined,
      content: parsed.promptContent,
    };
  }

  /** Load a single command from a file path. */
  async loadFromFile(filePath: string): Promise<SlashCommand | null> {
    try {
      const content = await this.adapter.read(filePath);
      return this.parseFile(content, filePath);
    } catch (error) {
      console.error(`[ObsidianCode] Failed to read command file ${filePath}:`, error);
      return null;
    }
  }

  /** Save a command to its file. */
  async save(command: SlashCommand): Promise<void> {
    const filePath = this.getFilePath(command);
    const content = this.serializeCommand(command);
    await this.adapter.write(filePath, content);
  }

  /** Delete a command file by ID. */
  async delete(commandId: string): Promise<void> {
    // Find the file by listing and matching ID
    const files = await this.adapter.listFilesRecursive(COMMANDS_PATH);

    for (const filePath of files) {
      if (!filePath.endsWith('.md')) continue;

      const id = this.filePathToId(filePath);
      if (id === commandId) {
        await this.adapter.delete(filePath);
        return;
      }
    }
  }

  /** Check if any commands exist. */
  async hasCommands(): Promise<boolean> {
    const files = await this.adapter.listFilesRecursive(COMMANDS_PATH);
    return files.some(f => f.endsWith('.md'));
  }

  /** Get the file path for a command. */
  getFilePath(command: SlashCommand): string {
    // Convert command name to file path
    // e.g., "review-code" -> ".claude/commands/review-code.md"
    // For nested commands, use slashes: "code/refactor" -> ".claude/commands/code/refactor.md"
    const safeName = command.name.replace(/[^a-zA-Z0-9_/-]/g, '-');
    return `${COMMANDS_PATH}/${safeName}.md`;
  }

  /** Parse a command file into a SlashCommand object. */
  parseFile(content: string, filePath: string): SlashCommand {
    const parsed = parseSlashCommandContent(content);
    const id = this.filePathToId(filePath);
    const name = this.filePathToName(filePath);

    return {
      id,
      name,
      description: parsed.description,
      argumentHint: parsed.argumentHint,
      allowedTools: parsed.allowedTools,
      model: parsed.model as ClaudeModel | undefined,
      content: parsed.promptContent,
    };
  }

  /** Convert a file path to a command ID (reversible encoding). */
  private filePathToId(filePath: string): string {
    // Encoding: escape `-` as `-_`, then replace `/` with `--`
    // This is unambiguous and reversible:
    //   a/b.md   -> cmd-a--b
    //   a-b.md   -> cmd-a-_b
    //   a--b.md  -> cmd-a-_-_b
    //   a/b-c.md -> cmd-a--b-_c
    const relativePath = filePath
      .replace(`${COMMANDS_PATH}/`, '')
      .replace(/\.md$/, '');
    const escaped = relativePath
      .replace(/-/g, '-_')   // Escape dashes first
      .replace(/\//g, '--'); // Then encode slashes
    return `cmd-${escaped}`;
  }

  /** Convert a file path to a command name. */
  private filePathToName(filePath: string): string {
    // .claude/commands/nested/foo.md -> nested/foo
    return filePath
      .replace(`${COMMANDS_PATH}/`, '')
      .replace(/\.md$/, '');
  }

  /** Serialize a command to Markdown with YAML frontmatter. */
  private serializeCommand(command: SlashCommand): string {
    const lines: string[] = ['---'];

    if (command.description) {
      lines.push(`description: ${this.yamlString(command.description)}`);
    }
    if (command.argumentHint) {
      lines.push(`argument-hint: ${this.yamlString(command.argumentHint)}`);
    }
    if (command.allowedTools && command.allowedTools.length > 0) {
      lines.push('allowed-tools:');
      for (const tool of command.allowedTools) {
        lines.push(`  - ${tool}`);
      }
    }
    if (command.model) {
      lines.push(`model: ${command.model}`);
    }

    lines.push('---');

    // Extract prompt content (strip existing frontmatter if present)
    const parsed = parseSlashCommandContent(command.content);
    lines.push(parsed.promptContent);

    return lines.join('\n');
  }

  /** Quote a YAML string if needed. */
  private yamlString(value: string): string {
    if (value.includes(':') || value.includes('#') || value.includes('\n') ||
        value.startsWith(' ') || value.endsWith(' ')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
}
