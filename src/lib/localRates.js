import { openDB } from "idb";
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
export async function loadCachedRates() {
    const d = await db();
    const data = (await d.get(STORE, "payload"));
    return data || null;
}
export async function saveRates(payload) {
    const d = await db();
    await d.put(STORE, payload, "payload");
}
