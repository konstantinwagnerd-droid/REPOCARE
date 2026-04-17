import { listTemplates } from "@/lib/press-release/templates";
import { PressReleaseClient } from "./client";

export const metadata = { title: "Press-Release-Generator · CareAI" };

export default function PressReleasePage() {
  const templates = listTemplates();
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Press-Release-Generator</h1>
        <p className="text-muted-foreground mt-1">
          Wähle ein Template, fülle die Felder — rechts siehst du die fertige PM in Echtzeit.
          Qualitäts-Score zeigt, ob sie versandreif ist.
        </p>
      </header>
      <PressReleaseClient templates={templates} />
    </div>
  );
}
