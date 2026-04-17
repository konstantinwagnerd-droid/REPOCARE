import { ThemeCustomizer } from "@/components/admin/theme-customizer";

export const metadata = { title: "Theme — CareAI Admin" };

export default function ThemeSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Theme</h1>
        <p className="mt-2 text-muted-foreground">
          Passen Sie das Farbschema an Ihre Einrichtung an. Aenderungen sind sofort fuer alle Nutzer sichtbar.
        </p>
      </div>
      <ThemeCustomizer />
    </div>
  );
}
