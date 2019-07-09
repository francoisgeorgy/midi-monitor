import {computed, decorate, observable} from 'mobx';
import parseMidi from "parse-midi";

export const DIRECTION_READ = 'reading';    // value must also match css class used like .midi-progress.reading
export const DIRECTION_WRITE = 'writing';   // value must also match css class used like .midi-progress.writing

const MIDI_CONSOLE_SIZE = 100;

class AppState {

    midi = {
        input: null,        // midi port ID
        output: null        // midi port ID
    };

    messages = [];       // MIDI monitor

    device_ok = false;

    get connected() {
        return !!(this.midi.input && this.midi.output);
    }

    setMidiInput(port_id) {
        const changed = port_id !== this.midi.input;   // to force checkDevice with we replace an output by another output
        this.midi.input = port_id;
        if (changed) {
            this.device_ok = false;
        }
        // if (port_id) {
        //     this.checkDevice();
        // }
    }

/*
    setMidiOutput(port_id) {
        const changed = port_id !== this.midi.output;   // to force checkDevice with we replace an output by another output
        this.midi.output = port_id;
        if (changed) {
            this.device_ok = false;
        }
        // if (port_id) {
        //     this.checkDevice();
        // }
    }
*/

    appendMessageIn(msg) {
        // const M = this.messages_in;
        if (this.messages.length >= MIDI_CONSOLE_SIZE) {
            this.messages.shift();
        }

        const m = {};
        m.direction = "receive";
        m.timestamp = msg.timestamp;
        m.data = msg.data;
        m.source = msg.target.name;
        m.sysex = false;
        m.view_full = false;

        const p = parseMidi(msg.data);

        if (global.dev) console.log("appendMessageIn", p);

        m.channel = p.channel;
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
    device_ok: observable,
    connected: computed
});

export const appState = new AppState();
