/**
 * Minimal global event bus for voice commands. Components subscribe
 * via `onVoiceEvent` and receive payloads emitted by intent actions.
 */

type Listener = (event: { type: string; payload?: unknown }) => void;

const listeners = new Set<Listener>();

export function emitVoiceEvent(event: { type: string; payload?: unknown }) {
  if (typeof window === "undefined") return;
  listeners.forEach((l) => {
    try {
      l(event);
    } catch {
      /* ignore listener errors */
    }
  });
  // Also dispatch a CustomEvent on window for non-React consumers
  window.dispatchEvent(new CustomEvent(`voice:${event.type}`, { detail: event.payload }));
}

export function onVoiceEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
