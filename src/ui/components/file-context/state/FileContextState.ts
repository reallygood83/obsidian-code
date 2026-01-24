/**
 * File context session state.
 */

/** Escape special regex characters in a string. */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class FileContextState {
  private attachedFiles: Set<string> = new Set();
  /** Files that are explicitly attached (via command or @-mention) and won't be replaced. */
  private pinnedFiles: Set<string> = new Set();
  private sessionStarted = false;
  private mentionedMcpServers: Set<string> = new Set();
  private currentNoteSent = false;
  private sentCurrentNotePath: string | null = null;
  /** Maps display name (e.g., "@folder/file.ts") to absolute path for context files. */
  private contextFileMap: Map<string, string> = new Map();

  getAttachedFiles(): Set<string> {
    return new Set(this.attachedFiles);
  }

  getPinnedFiles(): Set<string> {
    return new Set(this.pinnedFiles);
  }

  /** Check if there are any pinned files. */
  hasPinnedFiles(): boolean {
    return this.pinnedFiles.size > 0;
  }

  shouldSendCurrentNote(notePath: string | null | undefined): boolean {
    if (!notePath) return false;
    return !this.currentNoteSent || this.sentCurrentNotePath !== notePath;
  }

  markCurrentNoteSent(notePath: string | null | undefined): void {
    if (!notePath) return;
    this.currentNoteSent = true;
    this.sentCurrentNotePath = notePath;
  }

  markCurrentNoteAlreadySent(notePath: string | null | undefined): void {
    this.currentNoteSent = !!notePath;
    this.sentCurrentNotePath = notePath ?? null;
  }

  isSessionStarted(): boolean {
    return this.sessionStarted;
  }

  startSession(): void {
    this.sessionStarted = true;
  }

  resetForNewConversation(): void {
    this.sessionStarted = false;
    this.currentNoteSent = false;
    this.sentCurrentNotePath = null;
    this.attachedFiles.clear();
    this.pinnedFiles.clear();
    this.contextFileMap.clear();
    this.clearMcpMentions();
  }

  resetForLoadedConversation(hasMessages: boolean): void {
    this.currentNoteSent = hasMessages;
    this.sentCurrentNotePath = null;
    this.attachedFiles.clear();
    this.pinnedFiles.clear();
    this.contextFileMap.clear();
    this.sessionStarted = hasMessages;
    this.clearMcpMentions();
  }

  setAttachedFiles(files: string[]): void {
    this.attachedFiles.clear();
    for (const file of files) {
      this.attachedFiles.add(file);
    }
  }

  attachFile(path: string): void {
    this.attachedFiles.add(path);
  }

  /** Pin a file (explicitly attached, won't be auto-replaced). */
  pinFile(path: string): void {
    this.attachedFiles.add(path);
    this.pinnedFiles.add(path);
  }

  /** Check if a file is pinned. */
  isPinned(path: string): boolean {
    return this.pinnedFiles.has(path);
  }

  /** Unpin a file (keeps it attached but allows auto-replacement). */
  unpinFile(path: string): void {
    this.pinnedFiles.delete(path);
  }

  /** Attach a context file with display name to absolute path mapping. */
  attachContextFile(displayName: string, absolutePath: string): void {
    this.attachedFiles.add(absolutePath);
    this.pinnedFiles.add(absolutePath);  // Context files are always pinned
    this.contextFileMap.set(displayName, absolutePath);
  }

  detachFile(path: string): void {
    this.attachedFiles.delete(path);
    this.pinnedFiles.delete(path);
  }

  clearAttachments(): void {
    this.attachedFiles.clear();
    this.contextFileMap.clear();
    // Note: pinnedFiles are NOT cleared here - they persist until new conversation
  }

  /** Clear only non-pinned attachments (for when opening new files). */
  clearNonPinnedAttachments(): void {
    const toRemove: string[] = [];
    for (const file of this.attachedFiles) {
      if (!this.pinnedFiles.has(file)) {
        toRemove.push(file);
      }
    }
    for (const file of toRemove) {
      this.attachedFiles.delete(file);
    }
  }

  /** Transform text by replacing context file display names with absolute paths. */
  transformContextMentions(text: string): string {
    let result = text;
    for (const [displayName, absolutePath] of this.contextFileMap) {
      // Replace @folder/file.ts with absolute path
      result = result.replace(new RegExp(escapeRegExp(displayName), 'g'), absolutePath);
    }
    return result;
  }

  getMentionedMcpServers(): Set<string> {
    return new Set(this.mentionedMcpServers);
  }

  clearMcpMentions(): void {
    this.mentionedMcpServers.clear();
  }

  setMentionedMcpServers(mentions: Set<string>): boolean {
    const changed =
      mentions.size !== this.mentionedMcpServers.size ||
      [...mentions].some(name => !this.mentionedMcpServers.has(name));

    if (changed) {
      this.mentionedMcpServers = new Set(mentions);
    }

    return changed;
  }

  addMentionedMcpServer(name: string): void {
    this.mentionedMcpServers.add(name);
  }
}
