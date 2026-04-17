/**
 * Learning-Score fuer ein Post-Mortem.
 *
 * Berechnet, wie viele Action-Items umgesetzt wurden (0..100).
 * Fliesst in "Lessons Learned"-Status ein.
 */

import type { ActionItem, PostMortem } from "./types";

export function computeLearningScore(items: ActionItem[]): number {
  if (items.length === 0) return 0;
  const done = items.filter((i) => i.status === "erledigt").length;
  const discarded = items.filter((i) => i.status === "verworfen").length;
  const effective = items.length - discarded;
  if (effective === 0) return 100;
  return Math.round((done / effective) * 100);
}

/** Ob das PM in Status "lessons_learned" ueberfuehrt werden darf. */
export function isLessonsLearnedReady(pm: PostMortem): boolean {
  const score = computeLearningScore(pm.actionItems);
  return (
    pm.signOffs.length >= 1 &&
    pm.actionItems.length > 0 &&
    score >= 80 &&
    pm.whatWentWell.length > 0 &&
    pm.whatWentWrong.length > 0
  );
}
