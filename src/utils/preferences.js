import store from "storejs";

export const LOCAL_STORAGE_KEY = "studiocode.midimonitor.preferences";

const MIDI_CONSOLE_SIZE = 100;

export const DEFAULT_PREFERENCES = {
    queue_size: MIDI_CONSOLE_SIZE,
    octaveMiddleC: 4,
    show: {
        time: true,
        source: true,
        dataDec: true,
        dataHex: true,
        realtime: true,
        sysex: true,
        channels: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    }
}



// let preferences = {
//     // midi_channel: 1,
//     // input_device_id: null,      // web midi port ID
//     // output_device_id: null,     // web midi port ID
//     show: null
// };

// let preferences = null;

export function loadPreferences() {
    const s = store.get(LOCAL_STORAGE_KEY);
    // let preferences = null;
    return Object.assign({}, DEFAULT_PREFERENCES, s ? JSON.parse(s) : {});
    // if (s) {
    //     return Object.assign({}, DEFAULT_PREFERENCES, JSON.parse(s));
    // } else {
    //     return DEFAULT_PREFERENCES;
    // }
    // return preferences;
}

export function savePreferences(options = {}) {
    // let p = loadPreferences();
    // let preferences = {};
    // Object.assign(preferences, preferences, options);
    store(LOCAL_STORAGE_KEY, JSON.stringify(Object.assign({}, loadPreferences(), options)));
}
