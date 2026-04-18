"use client";

import { useEffect, useState } from "react";

type Rule = {
  id: string;
  name: string;
  matchType: "subject_contains" | "body_contains" | "from_domain";
  matchValue: string;
  classification: "lead" | "application" | "complaint" | "support" | "other";
  priority: number;
  active: boolean;
};

type TestResult = {
  classification: string;
  confidence: number;
  routedTo: string;
  reason: string;
  matchedRule?: string;
};

const defaultForm = {
  name: "",
  matchType: "subject_contains" as Rule["matchType"],
  matchValue: "",
  classification: "lead" as Rule["classification"],
  priority: 100,
  active: true,
};

export function RoutingClient() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [testInput, setTestInput] = useState({
    from: "interessent@example.com",
    subject: "Anfrage zu Demo",
    text: "Guten Tag, ich haette gerne Informationen zu Preise und eine Demo fuer 80 Betten.",
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/rules");
      const data = await res.json();
      setRules(data.rules ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function addRule() {
    if (!form.name || !form.matchValue) return;
    await fetch("/api/email/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(defaultForm);
    await load();
  }

  async function deleteRule(id: string) {
    await fetch(`/api/email/rules?id=${id}`, { method: "DELETE" });
    await load();
  }

  async function runTest() {
    const res = await fetch("/api/email/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: testInput }),
    });
    const data = await res.json();
    setTestResult(data.result);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Neue Regel</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded border px-2 py-1 text-sm md:col-span-2"
          />
          <select
            value={form.matchType}
            onChange={(e) => setForm({ ...form, matchType: e.target.value as Rule["matchType"] })}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="subject_contains">Betreff enthaelt</option>
            <option value="body_contains">Text enthaelt</option>
            <option value="from_domain">Absender-Domain</option>
          </select>
          <input
            placeholder="Wert"
            value={form.matchValue}
            onChange={(e) => setForm({ ...form, matchValue: e.target.value })}
            className="rounded border px-2 py-1 text-sm"
          />
          <select
            value={form.classification}
            onChange={(e) => setForm({ ...form, classification: e.target.value as Rule["classification"] })}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="lead">Lead</option>
            <option value="application">Bewerbung</option>
            <option value="complaint">Beschwerde</option>
            <option value="support">Support</option>
            <option value="other">Sonstiges</option>
          </select>
          <input
            type="number"
            placeholder="Prio"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <button onClick={() => void addRule()} className="mt-3 rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white">
          Regel hinzufuegen
        </button>
      </section>

      <section className="rounded-lg border bg-white shadow-sm">
        <h2 className="border-b p-3 font-semibold">Regeln ({rules.length})</h2>
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Lade…</p>
        ) : rules.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Noch keine Regeln. Default-Keyword-Matching greift automatisch.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Typ</th>
                <th className="p-3">Wert</th>
                <th className="p-3">→</th>
                <th className="p-3">Prio</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-xs">{r.matchType}</td>
                  <td className="p-3 text-xs"><code>{r.matchValue}</code></td>
                  <td className="p-3 text-xs">{r.classification}</td>
                  <td className="p-3 text-xs">{r.priority}</td>
                  <td className="p-3">
                    <button onClick={() => void deleteRule(r.id)} className="text-xs text-rose-600 hover:underline">
                      loeschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Test: "Was wuerde diese Mail triggern?"</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <input
            placeholder="Von"
            value={testInput.from}
            onChange={(e) => setTestInput({ ...testInput, from: e.target.value })}
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            placeholder="Betreff"
            value={testInput.subject}
            onChange={(e) => setTestInput({ ...testInput, subject: e.target.value })}
            className="rounded border px-2 py-1 text-sm md:col-span-2"
          />
          <textarea
            placeholder="Body-Text"
            value={testInput.text}
            onChange={(e) => setTestInput({ ...testInput, text: e.target.value })}
            className="min-h-[80px] rounded border px-2 py-1 text-sm md:col-span-3"
          />
        </div>
        <button onClick={() => void runTest()} className="mt-3 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white">
          Klassifizieren
        </button>
        {testResult && (
          <div className="mt-3 rounded bg-slate-50 p-3 text-sm">
            <p><strong>Kategorie:</strong> {testResult.classification} ({Math.round(testResult.confidence * 100)}%)</p>
            <p><strong>Routing:</strong> {testResult.routedTo}</p>
            <p className="text-xs text-slate-500"><strong>Grund:</strong> {testResult.reason}</p>
            {testResult.matchedRule && <p className="text-xs text-slate-500">Regel: {testResult.matchedRule}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
