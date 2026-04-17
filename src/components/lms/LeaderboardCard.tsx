import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/lms/types";

export function LeaderboardCard({
  entries,
  currentUserId,
  anonymized = false,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  anonymized?: boolean;
}) {
  const medal = ["🥇", "🥈", "🥉"];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" /> Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.slice(0, 8).map((e, i) => {
          const isMe = e.userId === currentUserId;
          const displayName = anonymized && !isMe ? `Mitarbeiter:in #${e.rank}` : e.displayName;
          return (
            <div
              key={e.userId}
              className={`flex items-center justify-between rounded-xl border p-3 text-sm ${
                isMe ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-serif font-semibold">
                  {i < 3 ? medal[i] : e.rank}
                </span>
                <div>
                  <div className="font-semibold">{displayName}{isMe && " (Sie)"}</div>
                  {e.team && <div className="text-xs text-muted-foreground">{e.team}</div>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-lg font-semibold">{e.points}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {e.coursesCompleted} Kurse
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
