import { WoundTimelapseClient } from "@/components/wound-timelapse/WoundTimelapseClient";

export const metadata = { title: "Wund-Verlauf · CareAI" };

interface PageProps {
  params: Promise<{ id: string; woundId: string }>;
}

export default async function WoundTimelapsePage({ params }: PageProps) {
  const { id, woundId } = await params;
  return (
    <div className="mx-auto max-w-7xl p-6">
      <WoundTimelapseClient
        bewohnerId={id}
        woundId={woundId}
        bewohnerName="Frau Anna Huber"
        lokalisation="Sakrum (Steissbein)"
      />
    </div>
  );
}
