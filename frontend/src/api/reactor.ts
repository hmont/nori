import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nori.reactorId';

let cached: Promise<string> | undefined;

function generateId() {
  const random = () => Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${random()}${random()}`;
}

/**
 * An anonymous id for this device. Nori has no accounts, so the backend uses it to remember which
 * reactions are yours and to stop one device from piling up the same reaction.
 */
export function getReactorId(): Promise<string> {
  cached ??= (async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const id = generateId();
    await AsyncStorage.setItem(STORAGE_KEY, id);
    return id;
  })();
  return cached;
}
