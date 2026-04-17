"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, Plus, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { key: "willkommen", label: "Willkommen" },
  { key: "branding", label: "Branding" },
  { key: "team", label: "Team" },
  { key: "bewohner", label: "Bewohner" },
  { key: "integrationen", label: "Integrationen" },
  { key: "fertig", label: "Los geht's" },
] as const;

type State = {
  name: string;
  adresse: string;
  traeger: string;
  betten: number;
  primary: string;
  logoName: string;
  invites: { email: string; role: string }[];
  csvName: string;
  integrations: string[];
};

const defaultState: State = {
  name: "",
  adresse: "",
  traeger: "Privat",
  betten: 50,
  primary: "#0F766E",
  logoName: "",
  invites: [{ email: "", role: "DGKP" }],
  csvName: "",
  integrations: ["FHIR"],
};

const palette = ["#0F766E", "#14B8A6", "#2563EB", "#7C3AED", "#C2410C", "#059669", "#B45309"];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<State>(defaultState);

  const next = () => setStep((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStep((i) => Math.max(i - 1, 0));

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <nav aria-label="Onboarding-Fortschritt" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs">
          {steps.map((st, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li key={st.key} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className={active ? "font-medium" : "text-muted-foreground"}>{st.label}</span>
                {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
              </li>
            );
          })}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="p-8">
              {step === 0 && (
                <>
                  <h2 className="font-serif text-3xl font-semibold">Willkommen bei CareAI.</h2>
                  <p className="mt-3 text-muted-foreground">
                    Fuenf Minuten, sechs Schritte — und Sie koennen dokumentieren. Los geht&apos;s.
                  </p>
                  <div className="mt-8 grid gap-5">
                    <div>
                      <Label htmlFor="name">Name der Einrichtung</Label>
                      <Input
                        id="name"
                        value={s.name}
                        onChange={(e) => setS({ ...s, name: e.target.value })}
                        placeholder="z. B. Seniorenresidenz Hietzing"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adresse">Adresse</Label>
                      <Textarea
                        id="adresse"
                        value={s.adresse}
                        onChange={(e) => setS({ ...s, adresse: e.target.value })}
                        rows={2}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="traeger">Traeger-Typ</Label>
                        <select
                          id="traeger"
                          value={s.traeger}
                          onChange={(e) => setS({ ...s, traeger: e.target.value })}
                          className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {["Privat", "Konfessionell", "Oeffentlich", "Gemeinnuetzig", "Sozialversicherung"].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="betten">Anzahl Bewohner:innen</Label>
                        <Input
                          id="betten"
                          type="number"
                          value={s.betten}
                          onChange={(e) => setS({ ...s, betten: Number(e.target.value) })}
                          min={1}
                          max={2000}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-serif text-3xl font-semibold">Ihr Branding</h2>
                  <p className="mt-3 text-muted-foreground">
                    Laden Sie Ihr Logo hoch und waehlen Sie eine Primaerfarbe — die App passt sich an.
                  </p>
                  <div className="mt-8 grid gap-6">
                    <div>
                      <Label>Logo</Label>
                      <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 hover:border-primary/40 hover:bg-muted/60">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {s.logoName || "PNG/SVG, max. 2 MB hierher ziehen oder klicken"}
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/svg+xml"
                          className="sr-only"
                          onChange={(e) => setS({ ...s, logoName: e.target.files?.[0]?.name ?? "" })}
                        />
                      </label>
                    </div>
                    <div>
                      <Label>Primaerfarbe</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {palette.map((p) => (
                          <button
                            key={p}
                            onClick={() => setS({ ...s, primary: p })}
                            aria-label={`Farbe ${p}`}
                            aria-pressed={s.primary === p}
                            className="h-10 w-10 rounded-xl border-2 transition"
                            style={{
                              background: p,
                              borderColor: s.primary === p ? "hsl(var(--foreground))" : "transparent",
                            }}
                          />
                        ))}
                        <label className="flex items-center gap-2 rounded-xl border border-border px-3">
                          <input
                            type="color"
                            value={s.primary}
                            onChange={(e) => setS({ ...s, primary: e.target.value })}
                            className="h-6 w-6 cursor-pointer rounded"
                            aria-label="Eigene Farbe"
                          />
                          <span className="text-sm">Eigene</span>
                        </label>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Live-Vorschau
                      </div>
                      <div
                        className="mt-3 flex items-center gap-3 rounded-lg p-4 text-white"
                        style={{ background: s.primary }}
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="font-serif text-lg font-semibold">{s.name || "Ihre Einrichtung"}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-serif text-3xl font-semibold">Team einladen</h2>
                  <p className="mt-3 text-muted-foreground">
                    E-Mail + Rolle. Mitarbeitende erhalten einen Einladungs-Link (7 Tage gueltig).
                  </p>
                  <div className="mt-6 space-y-3">
                    {s.invites.map((inv, i) => (
                      <div key={i} className="grid grid-cols-[1fr_160px_40px] gap-3">
                        <Input
                          placeholder="email@einrichtung.at"
                          type="email"
                          value={inv.email}
                          onChange={(e) => {
                            const copy = [...s.invites];
                            copy[i].email = e.target.value;
                            setS({ ...s, invites: copy });
                          }}
                        />
                        <select
                          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={inv.role}
                          onChange={(e) => {
                            const copy = [...s.invites];
                            copy[i].role = e.target.value;
                            setS({ ...s, invites: copy });
                          }}
                        >
                          {["Admin", "PDL", "DGKP", "Pflegehilfe"].map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            setS({ ...s, invites: s.invites.filter((_, j) => j !== i) })
                          }
                          aria-label="Entfernen"
                          className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setS({ ...s, invites: [...s.invites, { email: "", role: "DGKP" }] })}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Weitere Person
                    </Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-serif text-3xl font-semibold">Bewohner-Import</h2>
                  <p className="mt-3 text-muted-foreground">
                    Laden Sie eine CSV mit Bestandsdaten hoch — oder ueberspringen und spaeter nachholen.
                  </p>
                  <div className="mt-6 grid gap-4">
                    <a
                      href="/templates/bewohner-import-template.csv"
                      className="inline-flex w-fit items-center gap-1 text-sm text-primary hover:underline"
                    >
                      CSV-Vorlage herunterladen
                    </a>
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 hover:border-primary/40">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium">{s.csvName || "CSV hochladen"}</span>
                      <input
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={(e) => setS({ ...s, csvName: e.target.files?.[0]?.name ?? "" })}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Mindestspalten: Vorname, Nachname, Geburtsdatum. Zusaetzlich moeglich: Zimmer, Einzugsdatum,
                      Pflegegrad.
                    </p>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="font-serif text-3xl font-semibold">Integrationen</h2>
                  <p className="mt-3 text-muted-foreground">
                    Welche Schnittstellen wollen Sie direkt einschalten? Aendern ist jederzeit moeglich.
                  </p>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {[
                      { key: "FHIR", label: "FHIR R4", desc: "Austausch mit Kliniken, ePA, ELGA" },
                      { key: "GDT", label: "GDT", desc: "Vitaldaten-Geraete" },
                      { key: "KIM", label: "KIM", desc: "Sicherer Arztbrief-Versand (DE)" },
                      { key: "DTA", label: "DTA", desc: "Abrechnung Pflegekasse (DE)" },
                      { key: "DATEV", label: "DATEV", desc: "Buchhaltung (DE)" },
                      { key: "BMD", label: "BMD", desc: "ERP/Lohn (AT)" },
                    ].map((i) => {
                      const active = s.integrations.includes(i.key);
                      return (
                        <label
                          key={i.key}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                            active ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() =>
                              setS({
                                ...s,
                                integrations: active
                                  ? s.integrations.filter((x) => x !== i.key)
                                  : [...s.integrations, i.key],
                              })
                            }
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium">{i.label}</div>
                            <div className="text-sm text-muted-foreground">{i.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              {step === 5 && (
                <div className="py-10 text-center">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.span>
                  <h2 className="mt-6 font-serif text-3xl font-semibold">Alles bereit.</h2>
                  <p className="mt-3 text-muted-foreground">
                    {s.name || "Ihre Einrichtung"} ist eingerichtet. {s.invites.filter((i) => i.email).length}{" "}
                    Einladungen werden versendet.
                  </p>
                  <Button asChild variant="accent" size="lg" className="mt-8">
                    <Link href="/app">Zum Dashboard</Link>
                  </Button>
                </div>
              )}

              {step < 5 && (
                <div className="mt-10 flex items-center justify-between">
                  <Button variant="outline" onClick={prev} disabled={step === 0}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Zurueck
                  </Button>
                  <Button variant="accent" onClick={next}>
                    Weiter <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
