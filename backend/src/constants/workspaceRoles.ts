export const WORKSPACE_ROLES = ["owner", "admin", "member", "viewer"] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const WORKSPACE_ROLE_RANK: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export const hasWorkspaceRole = (
  role: WorkspaceRole,
  minimum: WorkspaceRole
): boolean => WORKSPACE_ROLE_RANK[role] >= WORKSPACE_ROLE_RANK[minimum];
