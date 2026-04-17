/**
 * Spracheingabe: expo-av Aufnahme → /api/voice/transcribe → /api/voice/structure.
 * Format: M4A/AAC 64kbps mono — matcht die Web-App.
 */
import { Audio } from 'expo-av';
import { api } from './api';

export type TranscribeResult = {
  transcript: string;
  durationMs: number;
  confidence: number;
};

export type StructureResult = {
  summary: string;
  sisFields: Array<{ key: string; text: string; confidence: number }>;
  suggestions: string[];
};

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.MEDIUM,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 64000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 64000,
  },
};

export class VoiceRecorder {
  private recording: Audio.Recording | null = null;

  async requestPermissions(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }

  async start(onMeter?: (db: number) => void): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) throw new Error('Mikrofon-Berechtigung verweigert.');

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(RECORDING_OPTIONS);
    if (onMeter) {
      rec.setOnRecordingStatusUpdate((s) => {
        if (s.isRecording && typeof s.metering === 'number') onMeter(s.metering);
      });
      rec.setProgressUpdateInterval(80);
    }
    await rec.startAsync();
    this.recording = rec;
  }

  async stop(): Promise<string> {
    if (!this.recording) throw new Error('Keine aktive Aufnahme.');
    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI();
    this.recording = null;
    if (!uri) throw new Error('Aufnahme ohne URI.');
    return uri;
  }

  async cancel(): Promise<void> {
    if (!this.recording) return;
    try {
      await this.recording.stopAndUnloadAsync();
    } catch {
      /* ignore */
    }
    this.recording = null;
  }
}

export async function transcribe(uri: string): Promise<TranscribeResult> {
  return api.uploadFile<TranscribeResult>('/api/voice/transcribe', uri, 'audio');
}

export async function structure(transcript: string): Promise<StructureResult> {
  return api.post<StructureResult>(
    '/api/voice/structure',
    { transcript },
    {
      mock: {
        summary: transcript.slice(0, 140),
        sisFields: [
          { key: 'themenfeld-1', text: 'Kognition & Kommunikation', confidence: 0.82 },
          { key: 'themenfeld-4', text: 'Selbstversorgung', confidence: 0.71 },
        ],
        suggestions: ['Vitalwerte prüfen', 'Hydration dokumentieren'],
      },
    },
  );
}
