import localforage from "localforage";

let storeInstance: LocalForage | null = null;
let readyPromise: Promise<void> | null = null;

export function getStore(): LocalForage {
  if (!storeInstance) {
    storeInstance = localforage.createInstance({
      name: "reklamator-ai",
      storeName: "cases",
      description: "Lokalna baza spraw Reklamator AI",
    });
  }
  return storeInstance;
}

export async function ensureStorageReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = getStore().ready();
  }
  await readyPromise;
}

export type StorageDriverInfo = {
  driver: string;
  isPersistent: boolean;
  label: string;
};

export async function getDriverInfo(): Promise<StorageDriverInfo> {
  await ensureStorageReady();
  const driver = getStore().driver();
  const isPersistent = driver !== localforage.LOCALSTORAGE && driver !== "memoryStorage";
  let label = "Pamięć lokalna przeglądarki";
  if (driver === localforage.INDEXEDDB) label = "IndexedDB (zalecane)";
  else if (driver === localforage.WEBSQL) label = "WebSQL";
  else if (driver === localforage.LOCALSTORAGE) label = "localStorage";
  return { driver, isPersistent, label };
}
