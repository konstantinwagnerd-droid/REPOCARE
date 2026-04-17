export type ImpersonationSession = {
  id: string;
  adminUserId: string;
  adminEmail: string;
  adminName: string;
  targetUserId: string;
  targetEmail: string;
  targetName: string;
  targetRole: string;
  tenantId: string;
  reason: string;
  startedAt: number;
  endedAt: number | null;
  active: boolean;
};
