// Tour system — type definitions
// Zweck: Typsichere Beschreibung von Guided Tours fuer die 4 Hauptrollen.

export type TourRole = "pflegekraft" | "pdl" | "admin" | "angehoerige";

export type Placement = "top" | "right" | "bottom" | "left" | "center";

/**
 * Ein Schritt innerhalb einer Tour.
 * - selector: CSS-Selector oder data-tour-Attribut-Wert. `null` = zentriertes Modal ohne Spotlight.
 * - waitFor: optional — Tour-Overlay wartet bis Selector existiert (max 2s), sonst ueberspringt.
 * - route: optional — falls Tour die Route wechseln muss (zB. zu /app/bewohner).
 */
export interface TourStep {
  id: string;
  title: string;
  body: string;
  selector: string | null;
  placement?: Placement;
  waitFor?: boolean;
  route?: string;
}

export interface Tour {
  id: string;
  role: TourRole;
  title: string;
  description: string;
  steps: TourStep[];
}

export interface TourProgress {
  tourId: string;
  stepIndex: number;
  completed: boolean;
  startedAt: string;
  updatedAt: string;
}
