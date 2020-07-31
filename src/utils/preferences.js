import store from "storejs";

export const LOCAL_STORAGE_KEY = "studiocode.midimonitor.preferences";

const MIDI_CONSOLE_SIZE = 100;

export const DEFAULT_PREFERENCES = {
    queue_size: MIDI_CONSOLE_SIZE,
    octaveMiddleC: 4,
    bendRange: 2,   // semitones
    showFilters: false,
    show: {
        time: true,
        source: true,
        dataDec: true,
        dataHex: true,
        voice: true,
        mode: true,
        sysex: true,
        common: true,
        realtime: true,
        channels: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    }
}

export function loadPreferences() {
    const s = store.get(LOCAL_STORAGE_KEY);
    return Object.assign({}, DEFAULT_PREFERENCES, s ? JSON.parse(s) : {});
}

export function savePreferences(options = {}) {
    store(LOCAL_STORAGE_KEY, JSON.stringify(Object.assign({}, loadPreferences(), options)));
}
