import {decorate, observable} from 'mobx';
import parseMidi from "parse-midi";
import {dsbr, hsbr} from "../utils/hexstring";
import {noteNameWithOctave} from "../utils/midiNotes";
import {DEFAULT_PREFERENCES, loadPreferences, savePreferences} from "../utils/preferences";

class AppState {

    midi = {
        inputs: {}
    };

    // show = {
    //     time: true,
    //     source: true,
    //     dataDec: true,
    //     dataHex: true,
    //     realtime: true,
    //     sysex: true,
    //     channels: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    // };
    bendRange = DEFAULT_PREFERENCES.bendRange;
    showFilters = DEFAULT_PREFERENCES.showFilters;
    show = DEFAULT_PREFERENCES.show;
    octaveMiddleC = DEFAULT_PREFERENCES.octaveMiddleC;
    queue_size = DEFAULT_PREFERENCES.queue_size;


    messages = [];  // messages ready for displaying, and filtering

    constructor() {
        // console.log("AppState constructor", this.octaveMiddleC);
        const p = loadPreferences();
        // console.log("AppState constructor", p);
        this.bendRange = p.bendRange;
        this.showFilters = p.showFilters;
        this.show = p.show;
        this.octaveMiddleC = p.octaveMiddleC;
        this.queue_size = p.queue_size;
        // console.log("AppState constructor, preferences=", this.octaveMiddleC, p);
    }

    toggleShowFilters() {
        this.showFilters = !this.showFilters;
        savePreferences({showFilters: this.showFilters});
    }

    setQueueSize(size) {
        if (isNaN(size)) return;
        this.queue_size = size;
        savePreferences({queue_size: this.queue_size});
    }

    setOctaveMiddleC(octave) {
        if (isNaN(octave)) return;
        this.octaveMiddleC = octave;
        savePreferences({octaveMiddleC: octave});
    }

    setBendRange(semitones) {
        if (isNaN(semitones)) return;
        this.bendRange = semitones;
        savePreferences({bendRange: semitones});
    }

    toggleShowOption(key) {
        if (key in this.show) {
            this.show[key] = !this.show[key];
            savePreferences({show: this.show});
        }
    }

    /**
     *
     * @param channel 0..15
     */
    toggleChannel(channel) {
        this.show.channels[channel] = !this.show.channels[channel];
        savePreferences({show: this.show});
    }

    selectAllChannels() {
        for (let i=0; i < this.show.channels.length; i++) this.show.channels[i] = true;
        savePreferences({show: this.show});
    }

    unselectAllChannels() {
        //this.filters.channels.forEach((e, i) => {e = false});
        for (let i=0; i < this.show.channels.length; i++) this.show.channels[i] = false;
        savePreferences({show: this.show});
    }

    addInput(port) {
        // eslint-disable-next-line
        if (this.midi.inputs.hasOwnProperty(port.id) && this.midi.inputs[port.id] !== null) {
            // already registered
            return false;
        }
        if (global.dev) console.log('addInput', port.id);
        this.midi.inputs[port.id] = {
            name: port.name,
            manufacturer: port.manufacturer,
            enabled: false,     // TODO: rename to "armed" like "armed for recording" ?
            minimized: false,   // TODO
            nb_messages: 0,
            solo: false,        // TODO
            color: null,        // TODO
            muted: false,       // TODO
            hidden: false       // TODO
        };
        return true;
    }

    removeInput(port_id) {
        if (global.dev) console.log('removeInput', port_id);
        // delete this.midi.inputs[port.id];    // do not use delete with mobx; see https://github.com/mobxjs/mobx/issues/822
        this.midi.inputs[port_id] = null;
    }

    enableInput(port_id) {
        if (this.midi.inputs[port_id]) this.midi.inputs[port_id].enabled = true;
    }

    disableInput(port_id) {
        if (this.midi.inputs[port_id]) {
            this.midi.inputs[port_id].enabled = false;
            this.midi.inputs[port_id].solo = false;
            this.midi.inputs[port_id].muted = false;
        }
    }

/*
    setSolo(port_id) {
        if (!this.midi.inputs[port_id]) return;
        this.midi.inputs[port_id].solo = true;
        // mute all the other ports that are not solo
        Object.keys(this.midi.inputs).forEach(port_id => {
            this.midi.inputs[port_id].muted = !this.midi.inputs[port_id].solo;
            // if (!this.midi.inputs[port_id].solo) {
            //     this.midi.inputs[port_id].mute = true;
            // }
        });
    }
*/

    toggleSolo(port_id) {
        if (!this.midi.inputs[port_id]) return;
        this.midi.inputs[port_id].solo = !this.midi.inputs[port_id].solo;
        // if (this.midi.inputs[port_id].solo) = this.midi.inputs[port_id].muted = false;
/*
        // if at least one port is solo, mute all the other ports that are not solo
        if (this.midi.inputs[port_id].solo) {
            Object.keys(this.midi.inputs).forEach(port_id => {
                //FIXME: fix solo/mute toggling
                this.midi.inputs[port_id].muted = !this.midi.inputs[port_id].solo;
                // if (!this.midi.inputs[port_id].solo) {
                //     this.midi.inputs[port_id].mute = true;
                // }
            });
        }
*/
    }

    toggleMuted(port_id) {
        if (!this.midi.inputs[port_id]) return;
        this.midi.inputs[port_id].muted = !this.midi.inputs[port_id].muted;
        // if (this.midi.inputs[port_id].muted) = this.midi.inputs[port_id].solo = false;
    }

    toggleVisibility(port_id) {
        if (!this.midi.inputs[port_id]) return;
        this.midi.inputs[port_id].hidden = !this.midi.inputs[port_id].hidden;
    }

    clearMessages() {
        this.messages = [];
        Object.keys(this.midi.inputs).forEach(
            port_id => {
                if (this.midi.inputs[port_id]) this.midi.inputs[port_id].nb_messages = 0
            });
    }

    infoNote(number) {
        return `${number.toString().padStart(3)}  ${noteNameWithOctave(number, this.octaveMiddleC)}`.padEnd(9);
    }

    appendMessageIn(msg) {


        const p = parseMidi(msg.data);

        if (!this.show.channels[p.channel - 1]) return;

        switch (p.messageType) {

            case "noteoff":
            case "noteon":
            case "keypressure":
            case "controlchange":
            case "programchange":
            case "channelpressure":
            case "pitchbendchange":
                if (!this.show.voice) return;
                break;

            case "channelmodechange":
                if (!this.show.mode) return;
                break;

            default:
                if (msg.data[0] === 0xF1) {             // MIDI Time Code Quarter Frame
                    if (!this.show.common) return;
                } else if (msg.data[0] === 0xF2) {      // Song Position Pointer
                    if (!this.show.common) return;
                } else if (msg.data[0] === 0xF3) {      // Song Select
                    if (!this.show.common) return;
                } else if (msg.data[0] === 0xF6) {      // Tune Request
                    if (!this.show.common) return;
                } else if (msg.data[0] === 0xF7) {      // End of System Exclusive  // TODO: special treatment?
                    if (!this.show.common) return;
                } else if (msg.data[0] === 0xF8) {      // timing clock
                    if (!this.show.realtime) return;
                } else if (msg.data[0] === 0xFA) {      // start
                    if (!this.show.realtime) return;
                } else if (msg.data[0] === 0xFB) {      // continue
                    if (!this.show.realtime) return;
                } else if (msg.data[0] === 0xFC) {      // stop
                    if (!this.show.realtime) return;
                } else if (msg.data[0] === 0xFE) {      // active sensing
                    if (!this.show.realtime) return;
                } else if (msg.data[0] === 0xFF) {      // system reset
                    if (!this.show.realtime) return;

                } else if (msg.data[0] === 0xF0 && msg.data[msg.data.length-1] === 0xF7) {
                    if (!this.show.sysex) return;
                    // if (m.data[1] === 0x7E && m.data[2] === 0x00 && m.data[3] === 0x06) {
                    //     m.type = "ID resp.";
                    // } else {
                    //     m.type = "SysEx";
                    // }
                } else {
                    // m.type = "unknown";      // TODO
                }
                break;
        }


        if (this.midi.inputs[msg.target.id]) {
            this.midi.inputs[msg.target.id].nb_messages++;
        }

        // const M = this.messages_in;
        while (this.messages.length >= this.queue_size) {
            // this.messages.shift();
            this.messages.pop();
        }

        // const last_timestamp = this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : 0;
        const last_timestamp = this.messages.length > 0 ? this.messages[0].timestamp : 0;

        const m = {};
        m.direction = "receive";
        // m.timestamp = msg.timestamp;
        m.timestamp = Date.now();
        // m.timedelta = last_timestamp === 0 ? 0 : (msg.timestamp - last_timestamp);
        m.data = msg.data;
        m.source = msg.target.name;
        m.sysex = false;
        m.view_full = false;

        // display properties
        // const delta = m.timedelta = last_timestamp === 0 ? 0 : (msg.timestamp - last_timestamp);
        const delta = m.timedelta = last_timestamp === 0 ? 0 : (m.timestamp - last_timestamp);
        m.time_delta = delta.toFixed(2);
        m.raw_hex = hsbr(m.data);
        m.raw_dec = dsbr(m.data);
        m.info_note = '';
        m.info_cc = '';
        m.info = '';
        // m.info = hs(m.data);

//        const p = parseMidi(msg.data);

        // if (global.dev) console.log("appendMessageIn", p);

        m.channel = parseInt(p.channel, 10);

        switch (p.messageType) {
            case "noteoff":
                // m.type = "Note OFF";
                // m.data1 = p.key;
                // m.data2 = p.velocity;
                m.info = `Note OFF  ${this.infoNote(p.key)} velocity ${p.velocity}`;
                break;
            case "noteon":
                // m.type = "Note ON";
                // m.data1 = p.key;
                // m.data2 = p.velocity;
                m.info = `Note ON   ${this.infoNote(p.key)} velocity ${p.velocity}`;
                break;
            case "keypressure":
                // m.type = "Key Pressure";
                // m.data1 = p.key;
                // m.data2 = p.pressure;
                m.info = `Key Pressure note ${this.infoNote(p.key)} pressure ${p.pressure}`;
                break;
            case "controlchange":
                // m.type = "CC";
                // m.data1 = `${p.controlNumber} ${p.controlFunction || ''}`;
                // m.data1 = `${p.controlNumber}`;
                // m.data2 = p.controlValue === 0 ? '0' : (p.controlValue || '');
                const ccpc = (100 * p.controlValue / 127).toFixed(0).padStart(4, ' ')
                const cc = `#${p.controlNumber}`
                m.info = `CC${cc.padStart(4)}  value ${(p.controlValue || 0).toString().padStart(3)}  ${ccpc}%`;
                // m.info = `CC${cc.padStart(4)}  value ${p.controlValue || 0}`;
                break;
            case "channelmodechange":
                // m.type = "Channel Mode Change";
                // m.data1 = `${p.controlNumber} ${p.channelModeMessage}`;
                // m.data2 = p.controlValue === 0 ? '0' : (p.controlValue || '');
                m.info = `Channel Mode Change ${p.controlNumber} ${p.channelModeMessage}`;
                break;
            case "programchange":
                // m.type = "PC";
                // m.data1 = p.program === 0 ? '0' : (p.program || '');
                // m.data2 = '';
                m.info = `Program Change ${p.program === 0 ? '0' : (p.program || '')}`;
                break;
            case "channelpressure":
                // m.type = "Channel Pressure";
                // m.data1 = p.pressure;
                // m.data2 = '';
                m.info = `Channel Pressure ${p.pressure}`;
                break;
            case "pitchbendchange":

                // const pc = (100 * p.pitchBendMultiplier).toFixed(2).padStart(7, ' ')
                const pc = (100 * p.pitchBendMultiplier).toFixed(0).padStart(4, ' ')
                const semi = (this.bendRange * p.pitchBendMultiplier).toFixed(2).padStart(6, ' ');

                m.info =  `Pitch Bend ${p.pitchBend.toString().padStart(6, ' ')}  ${pc}%  ${semi} semitones`;
                // m.data1 = p.pitchBend;
                // m.data2 = p.pitchBendMultiplier;
                // m.info = `${m.data1.toString().padStart(6, ' ')}   ${m.data2.toFixed(2).padStart(5, ' ')}`;
                // m.info = <div className="pitch-bend"><div>{m.data1}</div><div>{m.data2}</div></div>
                break;
            default:

                // see also http://www.somascape.org/midi/tech/spec.html#usx7E7E

                // if (global.dev) console.log(m.data);

                if (m.data[0] === 0xF8) {
                    m.sysex = true;
                    m.info = "Clock beat";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xF2) {
                    m.sysex = true;
                    m.info = "Song Position Pointer";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xF3) {
                    m.sysex = true;
                    m.info = "Song Select";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xF6) {
                    m.sysex = true;
                    m.info = "Tune Request";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                // } else if (m.data[0] === 0xF7) {
                //     m.sysex = true;
                //     m.info = "End of System Exclusive";
                //     m.data1 = '';
                //     m.data2 = '';
                //     m.channel = '';
                } else if (m.data[0] === 0xFA) {
                    m.sysex = true;
                    m.info = "Clock Start";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFB) {
                    m.sysex = true;
                    m.info = "Clock Continue";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFC) {
                    m.sysex = true;
                    m.info = "Clock Stop";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFE) {
                    m.sysex = true;
                    m.info = "Active Sensing";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFF) {
                    m.sysex = true;
                    m.info = "System Reset";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xF0 && m.data[m.data.length-1] === 0xF7) {
                    m.sysex = true;
                    // F0 7E 00 06 01 F7
                    // F0 7E 00 06 02 00 02 17 0B 0B 00 00 00 0B F7
                    if (m.data[1] === 0x7E && m.data[2] === 0x00 && m.data[3] === 0x06) {
                        m.info = "ID resp.";
                    } else {
                        m.info = "SysEx";
                    }
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else {
                    m.info = "unknown";
                    m.data1 = p.data1;
                    m.data2 = p.data2;
                }
                break;
        }
        // this.messages.push(m);    //TODO: push parseMidi() and timestamp
        this.messages.unshift(m);
    }

/*
    appendMessageOut(bytes) {

        if (this.messages.length >= MIDI_CONSOLE_SIZE) {
            this.messages.shift();
        }

        const m = {};
        m.direction = "send";
        // m.timestamp = 0;    //not used
        m.data = bytes;
        m.source = 'editor';
        m.channel = '';
        m.sysex = false;

        if (m.data[0] === 0xF0 && m.data[m.data.length-1] === 0xF7) {
            m.sysex = true;
            if (m.data[1] === 0x7E && m.data[2] === 0x00 && m.data[3] === 0x06) {
                m.type = "ID req.";
            } else {
                m.type = "SysEx";
            }
            m.data1 = '';
            m.data2 = '';
        } else {
            m.type = "unknown";
            m.data1 = '';
            m.data2 = '';
        }

        // const p = parseMidi(msg.data);
        // m.channel = 0;  // TODO
        // m.type = "TODO";

        this.messages.push(m);    //TODO: push parseMidi() and timestamp
    }
*/

}

// https://mobx.js.org/best/decorators.html
decorate(AppState, {
    midi: observable,
    showFilters: observable,
    show: observable,
    octaveMiddleC: observable,
    bendRange: observable,
    messages: observable,
    queue_size: observable
    // device_ok: observable,
    // connected: computed
});

export const appState = new AppState();
