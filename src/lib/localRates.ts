import { openDB } from "idb";

type RatesPayload = {
  arbotect: any;
  tree_iv: any;
  iron: any;
  version: string;
};

const DB_NAME = "trunkcalc";
const STORE = "rates";

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(d) {
      if (!d.objectStoreNames.contains(STORE)) {
        d.createObjectStore(STORE);
      }
    }
  });
}

export async function loadCachedRates(): Promise<RatesPayload | null> {
  const d = await db();
  const data = (await d.get(STORE, "payload")) as RatesPayload | undefined;
  return data || null;
}

export async function saveRates(payload: RatesPayload) {
  const d = await db();
  await d.put(STORE, payload, "payload");
}
