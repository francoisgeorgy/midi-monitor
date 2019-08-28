import {decorate, observable} from 'mobx';
import parseMidi from "parse-midi";
import {ds, hs} from "../utils/hexstring";

const MIDI_CONSOLE_SIZE = 100;

class AppState {

    midi = {
        inputs: {}
    };

    messages = [];  // messages ready for displaying, and filtering

    queue_size = MIDI_CONSOLE_SIZE;

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

    appendMessageIn(msg) {

        if (this.midi.inputs[msg.target.id]) {
            this.midi.inputs[msg.target.id].nb_messages++;
        }

        // const M = this.messages_in;
        while (this.messages.length >= this.queue_size) {
            this.messages.shift();
        }

        const last_timestamp = this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : 0;

        const m = {};
        m.direction = "receive";
        m.timestamp = msg.timestamp;
        // m.timedelta = last_timestamp === 0 ? 0 : (msg.timestamp - last_timestamp);
        m.data = msg.data;
        m.source = msg.target.name;
        m.sysex = false;
        m.view_full = false;

        // display properties
        const delta = m.timedelta = last_timestamp === 0 ? 0 : (msg.timestamp - last_timestamp);
        m.time_delta = delta.toFixed(2);
        m.raw_hex = hs(m.data);
        m.raw_dec = ds(m.data);
        m.infos = hs(m.data);

        const p = parseMidi(msg.data);

        // if (global.dev) console.log("appendMessageIn", p);

        m.channel = parseInt(p.channel, 10);

        switch (p.messageType) {
            case "noteoff":
                m.type = "Note OFF";
                m.data1 = p.key;
                m.data2 = p.velocity;
                break;
            case "noteon":
                m.type = "Note ON";
                m.data1 = p.key;
                m.data2 = p.velocity;
                break;
            case "keypressure":
                m.type = "Key Pressure";
                m.data1 = p.key;
                m.data2 = p.pressure;
                break;
            case "controlchange":
                m.type = "CC";
                // m.data1 = `${p.controlNumber} ${p.controlFunction || ''}`;
                m.data1 = `${p.controlNumber}`;
                m.data2 = p.controlValue === 0 ? '0' : (p.controlValue || '');
                break;
            case "channelmodechange":
                m.type = "Channel Mode Change";
                m.data1 = `${p.controlNumber} ${p.channelModeMessage}`;
                m.data2 = p.controlValue === 0 ? '0' : (p.controlValue || '');
                break;
            case "programchange":
                m.type = "PC";
                m.data1 = p.program === 0 ? '0' : (p.program || '');
                m.data2 = '';
                break;
            case "channelpressure":
                m.type = "Channel Pressure";
                m.data1 = p.pressure;
                m.data2 = '';
                break;
            case "pitchbendchange":
                m.type = "Pitchbend Change";
                m.data1 = p.pitchBend;
                m.data2 = p.pitchBendMultiplier;
                break;
            default:

                // see also http://www.somascape.org/midi/tech/spec.html#usx7E7E

                // if (global.dev) console.log(m.data);

                if (m.data[0] === 0xF8) {
                    m.sysex = true;
                    m.type = "timing clock";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFA) {
                    m.sysex = true;
                    m.type = "start clock";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFB) {
                    m.sysex = true;
                    m.type = "continue clock";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFC) {
                    m.sysex = true;
                    m.type = "stop clock";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFE) {
                    m.sysex = true;
                    m.type = "active sensing";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xFF) {
                    m.sysex = true;
                    m.type = "system reset";
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else if (m.data[0] === 0xF0 && m.data[m.data.length-1] === 0xF7) {
                    m.sysex = true;
                    // F0 7E 00 06 01 F7
                    // F0 7E 00 06 02 00 02 17 0B 0B 00 00 00 0B F7
                    if (m.data[1] === 0x7E && m.data[2] === 0x00 && m.data[3] === 0x06) {
                        m.type = "ID resp.";
                    } else {
                        m.type = "SysEx";
                    }
                    m.data1 = '';
                    m.data2 = '';
                    m.channel = '';
                } else {
                    m.type = "unknown";
                    m.data1 = p.data1;
                    m.data2 = p.data2;
                }
                break;
        }
        this.messages.push(m);    //TODO: push parseMidi() and timestamp
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
    messages: observable,
    queue_size: observable
    // device_ok: observable,
    // connected: computed
});

export const appState = new AppState();
