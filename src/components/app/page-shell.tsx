/**
 * Pflegekraft-Bereich (App-Layer) Page Shell — re-exportiert die Shell-Komponenten
 * aus components/admin/page-shell, damit beide Bereiche dieselbe IA nutzen.
 *
 * Grund fuer zwei Import-Pfade: Admin-Layer (Verwaltung) und App-Layer (Pflegekraft)
 * haben unterschiedliche Default-Layouts (Sidebar vs. Topbar) — die Shell-Komponenten
 * selbst sind aber identisch, also geben wir sie hier einfach frei.
 */
export {
  PageHeader,
  PageSection,
  PageGrid,
  PageContainer,
  StatCard,
  Breadcrumbs,
  EmptyState,
  QuickAction,
} from "@/components/admin/page-shell";
export type {
  PageHeaderProps,
  PageSectionProps,
  PageGridProps,
  StatCardProps,
  QuickActionProps,
  Crumb,
} from "@/components/admin/page-shell";
