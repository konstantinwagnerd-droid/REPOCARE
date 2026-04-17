/**
 * AI Training Dataset Types for CareAI
 *
 * All datasets are synthetic and DSGVO-compliant. No real patient data.
 */

export type ConfidenceHint = "high" | "medium" | "low";

export interface DatasetEntry {
  /** Unique stable id, useful for deduplication and splits */
  id: string;
  /** Input prompt/content to the model */
  input: string;
  /** Expected output (supervised label) */
  output: string;
  /** Optional confidence hint for training weighting */
  confidence_hint?: ConfidenceHint;
  /** Metadata block for filters and provenance */
  meta?: {
    generator_version?: string;
    seed?: number;
    tags?: string[];
    dataset?: string;
  };
}

export interface TrainingSplit {
  train: DatasetEntry[];
  val: DatasetEntry[];
  test: DatasetEntry[];
}

export type DatasetName =
  | "sis-classification"
  | "vital-anomaly-detection"
  | "medication-interaction"
  | "care-report-generation"
  | "voice-transcription-corrections"
  | "dementia-validation-prompts"
  | "incident-postmortem-drafting";

export interface DatasetMetadata {
  name: DatasetName;
  description: string;
  sampleCount: number;
  lastGenerated: string;
  piiScanPassed: boolean;
  piiFindings: number;
  splits: {
    train: number;
    val: number;
    test: number;
  };
}

export interface PiiScanResult {
  entryId: string;
  findings: Array<{
    type: "name" | "address" | "phone" | "email" | "ssn" | "date_of_birth" | "medical_id";
    value: string;
    position: number;
  }>;
}

export interface ExportFormat {
  /** OpenAI fine-tune format: messages-based */
  openai: Array<{
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  }>;
  /** Anthropic Claude message format */
  anthropic: Array<{
    system?: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  }>;
  /** HuggingFace datasets format (raw JSONL) */
  huggingface: DatasetEntry[];
}
