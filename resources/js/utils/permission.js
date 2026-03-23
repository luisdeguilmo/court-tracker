export function can(permission, auth) {
  return auth?.permissions?.includes(permission);
}

export function hasRole(role, auth) {
  return auth?.roles?.includes(role);
}