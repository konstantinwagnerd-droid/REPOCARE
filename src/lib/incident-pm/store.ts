/**
 * In-Memory-Store fuer Post-Mortems.
 *
 * Die DB-Schicht ist in dieser Iteration tabu (anderer Agent). Der Store
 * stellt die API-Oberflaeche bereit, persistiert prozessweit und kann
 * spaeter nahtlos durch eine Drizzle-Table ersetzt werden.
 */

import type { PostMortem, IncidentListItem, ActionItem, SignOff } from "./types";
import { makePostMortemFromTemplate } from "./templates";
import { computeLearningScore, isLessonsLearnedReady } from "./score";

type Store = {
  postmortems: Map<string, PostMortem>;
  byIncident: Map<string, string>; // incidentId -> pmId
  demoIncidents: IncidentListItem[];
};

const g = globalThis as unknown as { __careai_incident_pm?: Store };

function getStore(): Store {
  if (!g.__careai_incident_pm) {
    g.__careai_incident_pm = {
      postmortems: new Map(),
      byIncident: new Map(),
      demoIncidents: seedDemoIncidents(),
    };
  }
  return g.__careai_incident_pm;
}

function seedDemoIncidents(): IncidentListItem[] {
  const t = "demo-tenant";
  const now = Date.now();
  return [
    {
      id: "inc-demo-1",
      tenantId: t,
      residentId: "res-demo-1",
      residentName: "Erika Mustermann",
      occurredAt: new Date(now - 86_400_000 * 2).toISOString(),
      severity: "hoch",
      title: "Sturz im Badezimmer",
      description: "Bewohnerin beim Transfer gestuerzt, Prellung Hueftregion.",
    },
    {
      id: "inc-demo-2",
      tenantId: t,
      residentId: "res-demo-2",
      residentName: "Hans Beispiel",
      occurredAt: new Date(now - 86_400_000 * 7).toISOString(),
      severity: "kritisch",
      title: "Medikationsfehler: doppelte Dosis Marcoumar",
      description: "INR-Wert stark erhoeht, Arzt informiert, Antagonisierung.",
    },
    {
      id: "inc-demo-3",
      tenantId: t,
      residentId: "res-demo-3",
      residentName: "Ingrid Testperson",
      occurredAt: new Date(now - 86_400_000 * 14).toISOString(),
      severity: "mittel",
      title: "Vermisst-Meldung (30 Min)",
      description: "Bewohnerin unbemerkt das Haus verlassen, wohlbehalten zurueck.",
    },
  ];
}

export function listIncidents(tenantId: string): IncidentListItem[] {
  const s = getStore();
  return s.demoIncidents
    .filter((i) => i.tenantId === tenantId || tenantId === "*")
    .map((i) => {
      const pmId = s.byIncident.get(i.id);
      const pm = pmId ? s.postmortems.get(pmId) : undefined;
      return { ...i, postMortemId: pm?.id, postMortemStatus: pm?.status };
    });
}

export function addDemoIncident(inc: IncidentListItem): void {
  const s = getStore();
  s.demoIncidents.unshift(inc);
}

export function getPostMortemByIncident(incidentId: string): PostMortem | undefined {
  const s = getStore();
  const pmId = s.byIncident.get(incidentId);
  return pmId ? s.postmortems.get(pmId) : undefined;
}

export function getPostMortem(id: string): PostMortem | undefined {
  return getStore().postmortems.get(id);
}

export function createPostMortem(
  incidentId: string,
  tenantId: string,
  templateKey: string,
  title: string,
  createdBy: string,
): PostMortem {
  const s = getStore();
  const pm = makePostMortemFromTemplate(templateKey, incidentId, tenantId, title, createdBy);
  s.postmortems.set(pm.id, pm);
  s.byIncident.set(incidentId, pm.id);
  return pm;
}

export function savePostMortem(pm: PostMortem): PostMortem {
  const s = getStore();
  pm.updatedAt = new Date().toISOString();
  pm.learningScore = computeLearningScore(pm.actionItems);
  if (isLessonsLearnedReady(pm) && pm.status === "abgeschlossen") {
    pm.status = "lessons_learned";
  }
  s.postmortems.set(pm.id, pm);
  s.byIncident.set(pm.incidentId, pm.id);
  return pm;
}

export function addSignOff(incidentId: string, signOff: SignOff): PostMortem | undefined {
  const pm = getPostMortemByIncident(incidentId);
  if (!pm) return undefined;
  pm.signOffs.push(signOff);
  if (pm.signOffs.length >= 2) pm.status = "abgeschlossen";
  return savePostMortem(pm);
}

export function updateActionItems(incidentId: string, items: ActionItem[]): PostMortem | undefined {
  const pm = getPostMortemByIncident(incidentId);
  if (!pm) return undefined;
  pm.actionItems = items;
  return savePostMortem(pm);
}
