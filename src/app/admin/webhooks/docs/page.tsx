import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WEBHOOK_EVENTS, EVENT_DESCRIPTIONS } from "@/lib/webhooks/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const samplePayload = {
  id: "evt_01H9X2F6B8Q5",
  event: "report.signed",
  createdAt: "2026-04-17T08:42:11.000Z",
  tenantId: "hietzing",
  data: {
    reportId: "cr_8f3a1c",
    residentId: "res_2b9e74",
    signedBy: "user_4c1b88",
    signedAt: "2026-04-17T08:42:10.000Z",
    checksum: "sha256:a9f8…",
  },
};

const snippets = {
  node: `import crypto from "crypto";

export function verify(secret, header, body) {
  const parts = Object.fromEntries(header.split(",").map(p => p.split("=")));
  const expected = crypto.createHmac("sha256", secret)
    .update(\`\${parts.t}.\${body}\`).digest("hex");
  return expected === parts.v1;
}`,
  python: `import hmac, hashlib

def verify(secret: str, header: str, body: str) -> bool:
    parts = dict(p.split("=") for p in header.split(","))
    expected = hmac.new(
        secret.encode(), f"{parts['t']}.{body}".encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, parts["v1"])`,
  php: `<?php
function verifyCareAI($secret, $header, $body) {
    $parts = [];
    foreach (explode(',', $header) as $p) {
        [$k, $v] = explode('=', $p, 2);
        $parts[$k] = $v;
    }
    $expected = hash_hmac('sha256', $parts['t'] . '.' . $body, $secret);
    return hash_equals($expected, $parts['v1']);
}`,
};

export default function WebhooksDocsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3">
          <Link href="/admin/webhooks">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
        </Button>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Webhooks — API-Dokumentation</h1>
        <p className="mt-1 text-muted-foreground">
          CareAI sendet HTTP-POST-Requests an Ihren Endpoint, sobald ein Event eintritt.
          Alle Zustellungen sind HMAC-SHA256-signiert und werden bei Fehlern bis zu 5-mal wiederholt.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>1. Unterstützte Events</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr><th className="p-3">Event</th><th>Beschreibung</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WEBHOOK_EVENTS.map((e) => (
                  <tr key={e}>
                    <td className="p-3"><code className="font-mono text-xs">{e}</code></td>
                    <td>{EVENT_DESCRIPTIONS[e]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. Request-Format</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2"><Badge>POST</Badge><span>Ihr Endpoint</span></div>
            <div className="rounded-lg bg-muted p-3 font-mono text-xs">
              <div>Content-Type: application/json</div>
              <div>User-Agent: CareAI-Webhooks/1.0</div>
              <div>X-CareAI-Event: report.signed</div>
              <div>X-CareAI-Delivery-Id: 0c6f…</div>
              <div>X-CareAI-Signature: t=1729153331,v1=9f3c…</div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Beispiel-Body</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
{JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3. Signatur-Verifikation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Die Signatur hat das Format <code className="rounded bg-muted px-1">t=&lt;unix&gt;,v1=&lt;hex&gt;</code>.
            <code className="ml-1 rounded bg-muted px-1">v1</code> ist{" "}
            <code className="rounded bg-muted px-1">{`HMAC_SHA256(secret, t + "." + body)`}</code>.
            Verwerfen Sie Requests mit einem <code>t</code>-Abstand &gt; 5&nbsp;Minuten.
          </p>
          {Object.entries(snippets).map(([lang, code]) => (
            <div key={lang}>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lang}</div>
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{code}</pre>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Retry-Strategie</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Nicht-2xx-Antworten und Timeouts (&gt; 10&nbsp;s) führen zu automatischem Retry
            mit exponentieller Backoff-Kurve:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Versuch 1 → sofort</li>
            <li>Versuch 2 → nach 5&nbsp;Sekunden</li>
            <li>Versuch 3 → nach 15&nbsp;Sekunden</li>
            <li>Versuch 4 → nach 45&nbsp;Sekunden</li>
            <li>Versuch 5 → nach 2&nbsp;Min&nbsp;15&nbsp;Sek</li>
          </ul>
          <p>
            Nach 5 gescheiterten Versuchen wird der Delivery als <Badge variant="danger">failed</Badge>{" "}
            markiert. Re-Delivery manuell über das Delivery-Log möglich.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>5. Best Practices</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Antworten Sie innerhalb von 10&nbsp;Sekunden mit HTTP 2xx — asynchrone Verarbeitung in Ihrer Queue.</li>
            <li>Behandeln Sie Events <strong>idempotent</strong> — nutzen Sie <code>id</code> als Idempotency-Key.</li>
            <li>Verifizieren Sie <strong>immer</strong> die Signatur vor Verarbeitung.</li>
            <li>Nur HTTPS-Endpoints werden akzeptiert.</li>
            <li>Rotieren Sie Ihr Webhook-Secret regelmäßig (mindestens jährlich).</li>
            <li>Nutzen Sie IP-Whitelisting zusätzlich zur Signatur für kritische Systeme.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
