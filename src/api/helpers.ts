/** Simulates a network round-trip (200–400ms) so the UI can exercise real loading states against mock data. */
export function withDelay<T>(value: T): Promise<T> {
  const ms = 200 + Math.random() * 200
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
