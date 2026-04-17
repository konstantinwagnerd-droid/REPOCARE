'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, ScreenShare, Send, Shield, User,
} from 'lucide-react';
import type { Consultation, ConsultationMessage } from '@/lib/telemedizin/types';

type Props = { consultation: Consultation };

/**
 * WebRTC-Skelett. Verwendet navigator.mediaDevices.getUserMedia, falls
 * verfügbar. Signalisierung (SDP, ICE) ist vorbereitet, aber nicht live —
 * eine Signalisierungs-Server-Komponente (Socket.io) fehlt bewusst.
 */
export function RaumClient({ consultation }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConsultationMessage[]>(consultation.messages ?? []);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState(consultation.status);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
          setErr('Mediendevices in dieser Umgebung nicht verfügbar.');
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        setErr('Kamera/Mikrofon konnten nicht aktiviert werden. Prüfen Sie die Berechtigungen.');
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const s = videoRef.current?.srcObject as MediaStream | null;
    s?.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    const s = videoRef.current?.srcObject as MediaStream | null;
    s?.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  const beitreten = async () => {
    const participant = {
      id: 'p_nurse',
      role: 'pflege' as const,
      displayName: 'Anna Berger',
    };
    await fetch(`/api/telemedizin/consultations/${consultation.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant }),
    });
    setStatus('aktiv');
  };

  const auflegen = async () => {
    await fetch(`/api/telemedizin/consultations/${consultation.id}/join?participantId=p_nurse`, { method: 'DELETE' });
    setStatus('abgeschlossen');
  };

  const senden = async () => {
    const body = draft.trim();
    if (!body) return;
    const res = await fetch(`/api/telemedizin/consultations/${consultation.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorId: 'p_nurse',
        authorName: 'Anna Berger',
        authorRole: 'pflege',
        body,
      }),
    });
    if (res.ok) {
      const { message } = (await res.json()) as { message: ConsultationMessage };
      setMessages((prev) => [...prev, message]);
      setDraft('');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_380px]">
      <section className="flex flex-col gap-4 bg-gray-950 p-4 text-white">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/telemedizin" className="text-xs text-gray-400 hover:underline">← Zurück</Link>
            <h1 className="mt-1 font-serif text-2xl font-semibold">{consultation.subject}</h1>
            <p className="text-sm text-gray-400">
              {consultation.residentName} · {consultation.doctor.displayName} ·{' '}
              {new Date(consultation.scheduledAt).toLocaleString('de-AT')}
            </p>
          </div>
          <Badge variant={status === 'aktiv' ? 'success' : 'secondary'}>{status}</Badge>
        </header>

        <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          {err && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-red-300">
              {err}
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs">
            <Shield className="h-3.5 w-3.5 text-emerald-400" /> Ende-zu-Ende verschlüsselt (simuliert)
          </div>
          <div className="absolute right-3 top-3 h-28 w-44 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              <User className="mr-2 h-4 w-4" /> Arzt (Stub)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 p-2">
          <CtrlBtn onClick={() => setMicOn((v) => !v)} active={micOn} onIcon={<Mic />} offIcon={<MicOff />} label="Mikrofon" />
          <CtrlBtn onClick={() => setCamOn((v) => !v)} active={camOn} onIcon={<VideoIcon />} offIcon={<VideoOff />} label="Kamera" />
          <CtrlBtn onClick={() => alert('Bildschirm-Freigabe: nur Stub.')} active={false} onIcon={<ScreenShare />} offIcon={<ScreenShare />} label="Bildschirm" />
          {status !== 'aktiv' ? (
            <Button onClick={beitreten} className="bg-emerald-600 hover:bg-emerald-500">Beitreten</Button>
          ) : (
            <Button onClick={auflegen} variant="destructive"><PhoneOff className="mr-2 h-4 w-4" /> Auflegen</Button>
          )}
        </div>
      </section>

      <aside className="flex min-h-screen flex-col border-l border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Chat &amp; Notizen</h2>
          <p className="text-xs text-muted-foreground">Sichtbar für alle Teilnehmer:innen.</p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Nachrichten.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="rounded-lg border border-border bg-background p-3 text-sm">
                <div className="mb-1 text-xs text-muted-foreground">
                  {m.authorName} · {m.authorRole} · {new Date(m.sentAt).toLocaleTimeString('de-AT')}
                </div>
                <div>{m.body}</div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border p-3">
          <Textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nachricht …" />
          <Button onClick={senden} className="mt-2 w-full" disabled={!draft.trim()}>
            <Send className="mr-2 h-4 w-4" /> Senden
          </Button>
        </div>
      </aside>
    </div>
  );
}

function CtrlBtn({
  onClick,
  active,
  onIcon,
  offIcon,
  label,
}: {
  onClick: () => void;
  active: boolean;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} ${active ? 'ausschalten' : 'einschalten'}`}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'
      }`}
    >
      {active ? onIcon : offIcon}
    </button>
  );
}
