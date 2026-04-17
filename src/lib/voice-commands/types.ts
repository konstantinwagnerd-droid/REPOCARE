export type VoiceIntentCategory =
  | "navigation"
  | "resident"
  | "report"
  | "vital"
  | "medication"
  | "measure"
  | "emergency"
  | "shortcut";

export interface VoiceIntent {
  /** Unique id, e.g. "nav.dashboard" */
  id: string;
  category: VoiceIntentCategory;
  /** Human readable description in German */
  description: string;
  /** Example utterances shown in tutorial */
  examples: string[];
  /** Regex patterns — the first match wins, captures are passed to `action` */
  patterns: RegExp[];
  /** Action to execute. `context` contains utterance + matched groups + page context */
  action: (ctx: VoiceActionContext) => VoiceActionResult;
}

export interface VoiceActionContext {
  utterance: string;
  groups: string[];
  currentPath: string;
  currentResidentId?: string;
}

export interface VoiceActionResult {
  /** Spoken feedback for TTS */
  speak: string;
  /** Optional navigation target */
  navigate?: string;
  /** Optional event to emit on global bus */
  event?: { type: string; payload?: unknown };
  /** Mark as successful match */
  matched: boolean;
}

export interface MatchResult {
  intent: VoiceIntent | null;
  groups: string[];
  score: number;
  utterance: string;
}
