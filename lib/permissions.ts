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

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'catalogue:create',
    'catalogue:read',
    'catalogue:update',
    'catalogue:delete',
    'catalogue:toggle-visibility',
  ],
  'super-admin': [
    'catalogue:create',
    'catalogue:read',
    'catalogue:update',
    'catalogue:delete',
    'catalogue:toggle-visibility',
    'users:manage',
    'settings:configure',
    'audit-log:view',
  ],
}

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
