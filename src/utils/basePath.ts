export function getBasePath(): string {
  return process.env.NODE_ENV === 'production' ? '/copilot-user-level-statistics-viewer' : '';
}
