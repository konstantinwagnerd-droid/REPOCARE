"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Contact {
  id: string;
  phone: string;
  residentId: string | null;
  verified: boolean | null;
  consentGivenAt: string | null;
  consentScope: string | null;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

interface Message {
  id: string;
  contactId: string | null;
  direction: string;
  eventType: string | null;
  body: string;
  sentAt: string | null;
  createdAt: string;
}

interface TemplateItem {
  name: string;
  label: string;
  description: string;
  requiredVars: string[];
  scope: string;
}

interface Resident { id: string; fullName: string; }

export function WhatsappAdminClient({
  initialContacts,
  initialMessages,
  residents,
  templates,
}: {
  initialContacts: Contact[];
  initialMessages: Message[];
  residents: Resident[];
  templates: TemplateItem[];
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tplName, setTplName] = useState(templates[0]?.name ?? "incident_critical");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [newPhone, setNewPhone] = useState("");
  const [newResidentId, setNewResidentId] = useState("");
  const [newScope, setNewScope] = useState<"all" | "critical" | "daily">("critical");

  const currentTpl = templates.find((t) => t.name === tplName);

  async function addContact() {
    if (!newPhone) return;
    const res = await fetch("/api/whatsapp/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: newPhone,
        residentId: newResidentId || undefined,
        consentScope: newScope,
        consentGiven: true,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setContacts([...contacts, {
        ...json.contact,
        consentGivenAt: json.contact.consentGivenAt ?? new Date().toISOString(),
      }]);
      setNewPhone("");
      setNewResidentId("");
      toast.success(`Kontakt hinzugefuegt. WhatsApp-Registrierung: ${json.validation?.exists === true ? "ja" : json.validation?.exists === false ? "nein" : "unbekannt"}`);
    } else {
      toast.error(json.error ?? "Fehler");
    }
  }

  async function deleteContact(id: string) {
    const res = await fetch(`/api/whatsapp/contacts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("Kontakt geloescht");
    }
  }

  async function sendBulk() {
    if (selectedIds.size === 0) {
      toast.error("Keine Kontakte ausgewaehlt");
      return;
    }
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactIds: [...selectedIds],
        templateName: tplName,
        vars,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success(`Gesendet: ${json.sent}, uebersprungen: ${json.skipped}, fehlgeschlagen: ${json.failed}`);
      // naiv: reload ist easier — aber hier setzen wir nur nachricht append
      setMessages([
        ...selectedIds.size > 0 ? [] : [],
        ...messages,
      ]);
    } else {
      toast.error(json.error ?? "Fehler");
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Kontakt hinzufuegen</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Telefonnummer (E.164, z.B. +43...)</Label>
            <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+43..." />
          </div>
          <div>
            <Label>Bewohner:in (optional)</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={newResidentId}
              onChange={(e) => setNewResidentId(e.target.value)}
            >
              <option value="">— keine Verknuepfung —</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>{r.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Consent-Scope</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={newScope}
              onChange={(e) => setNewScope(e.target.value as "all" | "critical" | "daily")}
            >
              <option value="critical">Nur kritische Ereignisse</option>
              <option value="daily">Taegliche Updates</option>
              <option value="all">Alle Benachrichtigungen</option>
            </select>
          </div>
          <Button onClick={addContact}>Kontakt anlegen</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Massen-Send</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Template</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={tplName}
              onChange={(e) => { setTplName(e.target.value); setVars({}); }}
            >
              {templates.map((t) => (
                <option key={t.name} value={t.name}>{t.label} [{t.scope}]</option>
              ))}
            </select>
            {currentTpl && <p className="mt-1 text-xs text-muted-foreground">{currentTpl.description}</p>}
          </div>
          {currentTpl?.requiredVars.map((v) => (
            <div key={v}>
              <Label>{v}</Label>
              <Input value={vars[v] ?? ""} onChange={(e) => setVars({ ...vars, [v]: e.target.value })} />
            </div>
          ))}
          <div className="text-xs text-muted-foreground">
            {selectedIds.size} Empfaenger ausgewaehlt. Rate-Limit: 1 Nachricht/Sekunde pro Nummer.
          </div>
          <Button onClick={sendBulk} disabled={selectedIds.size === 0}>
            An {selectedIds.size} Kontakt{selectedIds.size === 1 ? "" : "e"} senden
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Kontakt-Liste ({contacts.length})</CardTitle></CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Kontakte angelegt.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="p-2"><input type="checkbox" onChange={(e) => setSelectedIds(new Set(e.target.checked ? contacts.map((c) => c.id) : []))} /></th>
                    <th className="p-2">Telefon</th>
                    <th className="p-2">Bewohner</th>
                    <th className="p-2">Scope</th>
                    <th className="p-2">Ruhezeiten</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2"><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                      <td className="p-2 font-mono">{c.phone}</td>
                      <td className="p-2">{residents.find((r) => r.id === c.residentId)?.fullName ?? "—"}</td>
                      <td className="p-2"><Badge variant="outline">{c.consentScope}</Badge></td>
                      <td className="p-2 text-xs text-muted-foreground">{c.quietHoursStart}–{c.quietHoursEnd}</td>
                      <td className="p-2">
                        {c.consentGivenAt ? <Badge variant="accent">Opt-in</Badge> : <Badge variant="outline">kein Consent</Badge>}
                        {c.verified ? <Badge className="ml-1" variant="outline">verified</Badge> : null}
                      </td>
                      <td className="p-2"><Button size="sm" variant="ghost" onClick={() => deleteContact(c.id)}>Loeschen</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Nachrichten-Historie (letzte 50)</CardTitle></CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Nachrichten.</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((m) => (
                <li key={m.id} className="rounded-lg border p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.direction === "outbound" ? "→" : "←"} {m.eventType ?? "message"}</span>
                    <span className="text-muted-foreground">{new Date(m.createdAt).toLocaleString("de-AT")}</span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-muted-foreground">{m.body}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
