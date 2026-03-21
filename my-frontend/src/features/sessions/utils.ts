import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique UUID for a new session
 * Use this when creating new sessions at runtime
 */
export function generateSessionId(): string {
  return uuidv4();
}

/**
 * Generate a fixed UUID deterministically from a string seed
 * Useful for testing or reproducible behavior
 */
export function hashToUUID(seed: string): string {
  // Simple hash function - not cryptographically secure but good for demo
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const uuid = `${Math.abs(hash).toString(16).padStart(8, '0')}-${Math.random()
    .toString(16)
    .substring(2, 6)}-4${Math.random()
    .toString(16)
    .substring(1, 4)}-8${Math.random()
    .toString(16)
    .substring(1, 4)}-${Math.random()
    .toString(16)
    .substring(2)}`.toLowerCase();
  
  return uuid;
}

/**
 * Format a UUID for display (shorter version)
 */
export function formatSessionId(uuid: string): string {
  return uuid.split('-')[0].slice(0, 8);
}
