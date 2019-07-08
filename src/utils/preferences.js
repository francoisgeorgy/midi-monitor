import store from "storejs";

export const LOCAL_STORAGE_KEY = "da.midibaby.preferences";

let preferences = {
    midi_channel: 1,
    input_device_id: null,      // web midi port ID
    output_device_id: null      // web midi port ID
};

export function loadPreferences() {
    const s = store.get(LOCAL_STORAGE_KEY);
    if (s) preferences = Object.assign(preferences, preferences, JSON.parse(s));
    return preferences;
}

export function savePreferences(options = {}) {
    loadPreferences();
    Object.assign(preferences, preferences, options);
    store(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
}
