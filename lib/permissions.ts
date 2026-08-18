export type Role = 'admin' | 'super-admin'

export type Permission =
  | 'catalogue:create'
  | 'catalogue:read'
  | 'catalogue:update'
  | 'catalogue:delete'
  | 'catalogue:toggle-visibility'
  | 'users:manage'
  | 'settings:configure'
  | 'audit-log:view'

const ADMIN_PERMISSIONS: Permission[] = [
  'catalogue:create',
  'catalogue:read',
  'catalogue:update',
  'catalogue:delete',
  'catalogue:toggle-visibility',
]

// super-admin is always everything admin can do, plus its own permissions —
// enforced structurally so a new admin permission can never be added here
// without super-admin silently keeping it too.
const rolePermissions: Record<Role, Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  'super-admin': [...ADMIN_PERMISSIONS, 'users:manage', 'settings:configure', 'audit-log:view'],
}

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
