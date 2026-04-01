type StorageItem<T> = {
  value: T;
  expiresAt: number; // timestamp em ms
};

export function setWithExpiry<T>(key: string, value: T, ttlMs: number) {
  const item: StorageItem<T> = {
    value,
    expiresAt: Date.now() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const item: StorageItem<T> = JSON.parse(raw);

  if (Date.now() > item.expiresAt) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
