import React from "react";
import {inject, observer} from "mobx-react";
import "./MidiHandler.css";
import {inputById, portById} from "../utils/ports";
import * as WebMidi from "webmidi";
import Ports from "./Ports";

const RECEIVE_MSG_TYPES = "midimessage";  // only receive sysex messages

// const ERROR_NO_ERROR = -1;
export const ERROR_MIDI_NOT_SUPPORTED = 1;
export const ERROR_MIDI_NOT_ENABLED = 2;
export const ERROR_UNKNOWN = 3;

// register : port is present / absent
// connect : we listen / we ignore

class MidiHandler extends React.Component {

    state = {
        error: null
    };

    onMidiError = (error) => {
        this.setState({error})
    };

    handleMidiInputEvent = (e) => {
        // console.log(e);
        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }
        console.log(e);
        // e.data is UInt8Array
        const S = this.props.appState;
        S.appendMessageIn(e);
    };

    connectInput = port => {
        if (port) {
            if (global.dev) console.log(`Midi.connectInput: connect input ${port.id}`);

            if (port.hasListener(RECEIVE_MSG_TYPES, 'all', this.handleMidiInputEvent)) {

                if (global.dev) console.warn(`Midi.connectInput: listener already connected`);

            } else {
                if (global.dev) console.log(`Midi.connectInput: add listener for all channels`);

                port.addListener(RECEIVE_MSG_TYPES, 'all', this.handleMidiInputEvent);

                // if (global.dev) console.log("Midi.connectInput: ", port.name);
                //FIXME: preferences
                // if (global.dev) console.log(`Midi.connectInput: set input input_device_id=${port.id} in preferences`);
                // savePreferences({input_device_id: port.id});

                this.props.appState.enableInput(port.id);
                // this.setState({input: port.id});
                // this.setState(produce(draft => draft.inputs[port.id].enable = true));
            }
        }
        //TODO: error if port null
    };

    disconnectInput = (port /*, updatePreferences=false*/) => {
        if (port) {
            if (global.dev) console.log(`Midi.disconnectInput: disconnect input ${port.id}`);
            if (port.removeListener) port.removeListener();

            this.props.appState.disableInput(port.id);

            //FIXME: preferences
            // if (global.dev) console.log(`Midi.connectInput: connect input set input_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({input_device_id: null});
            // }
        }
        //TODO: error if port null
    };

    autoConnectInput = (port) => {
        if (global.dev) console.log(`Midi.autoConnectInput ${port.id} ?`);

        this.connectInput(port);

        //FIXME: preferences
        /*
                const s = loadPreferences();
                if (s.input_device_id) {
                    if (this.state.input === null) {
                        if (port_id === s.input_device_id) {
                            this.connectInput(inputById(port_id));
                        }
                    } else {
                        if (global.dev) console.log(`Midi.autoConnectInput: autoConnect skipped, already connected`);
                    }
                }
        */
    };

    /**
     *
     * @param port_id
     */
    togglePort = (port_id) => {

        let p = portById(port_id);

        if (global.dev) console.log(`toggle ${p.type} ${port_id}`);

        if (this.props.appState.midi.inputs[port_id].enabled) {
            this.disconnectInput(portById(port_id), true);
        } else {
            this.connectInput(inputById(port_id));
        }
    };

    registerInput = (port) => {
        if (global.dev) console.log("registerInput", port.id);
        if (this.props.appState.addInput(port)) {
            this.autoConnectInput(port);
        }
    };

    unregisterInput = (port_id) => {
        if (global.dev) console.log("unregisterInput", port_id);
        this.props.appState.removeInput(port_id);
    };

    handleMidiConnectEvent = e => {
        if (e.port.type === "input") {
            // if (global.dev) console.log(`handleMidiConnectEvent: ${e.type} port: ${e.port.type} ${e.port.connection} ${e.port.state}: ${e.port.name} ${e.port.id}`, e);
            if (e.type === "disconnected") {    //FIXME: what is this?
                //TODO: use a copy of port.id in case port is delete too soon by the webmidi api
                const port_id = e.port.id;
                this.unregisterInput(port_id);
                this.disconnectInput(e.port);
            } else {
                // if (global.dev) console.log("Midi.handleMidiConnectEvent: call addInput");
                // if (e.port.connection === 'closed') {
                    this.registerInput(e.port);
                // }
                // do nothing if port.connection is 'open'
                // can it ben opened by some other app? YES: a port may already be opened by another app, and it that case we must connect to it
            }
        }
    };

    midiOn = err => {

        // noinspection JSUnresolvedVariable
        if (global.dev) console.log("webmidi.supported=", WebMidi.supported);
        // noinspection JSUnresolvedVariable
        if (global.dev) console.log("webmidi.enabled=", WebMidi.enabled);

        if (err) {
            console.warn("Midi.midiOn: WebMidi could not be enabled.", err);
            // if (global.dev) console.log(`err.name=${err.name} err.message=${err.message}`);
            // if (this.props.onError) {
                let code;
                // noinspection JSUnresolvedVariable
                if (!WebMidi.supported) {
                    code = ERROR_MIDI_NOT_SUPPORTED;
                } else { // noinspection JSUnresolvedVariable
                    if (!WebMidi.enabled) {
                        code = ERROR_MIDI_NOT_ENABLED;
                    } else {
                        code = ERROR_UNKNOWN;
                    }
                }
                this.onMidiError({code, message: err.message});
            // }
        } else {
            if (global.dev) console.log("Midi.midiOn: WebMidi enabled");
            // noinspection JSUnresolvedFunction
            WebMidi.addListener("connected", this.handleMidiConnectEvent);
            // noinspection JSUnresolvedFunction
            WebMidi.addListener("disconnected", this.handleMidiConnectEvent);
        }
    };

    componentDidMount() {
        // noinspection JSUnresolvedVariable
        if (global.dev) console.log(`Midi: component did mount: WebMidi.enabled=${WebMidi.enabled}`);
        // noinspection JSUnresolvedVariable
        if (WebMidi.enabled) {
            if (global.dev) console.log(`Midi: component did mount: already enabled, register ports`);
            // (https://github.com/eslint/eslint/issues/12117)
            // eslint-disable-next-line
            for (let port of WebMidi.inputs) {
                this.registerInput(port.id);
            }
            // this.registerOutputs();
        } else {
            if (global.dev) console.log("Midi: component did mount: Calling WebMidi.enable");
            // noinspection JSUnresolvedFunction
            WebMidi.enable(this.midiOn, true);  // true to enable sysex support
        }
    }

    componentWillUnmount() {
        if (global.dev) console.log("Midi: component will unmount: unregister all inputs");
        // (https://github.com/eslint/eslint/issues/12117)
        // eslint-disable-next-line
        for (let port of WebMidi.inputs) {
            this.unregisterInput(port);
            this.disconnectInput(port);
        }
    }

    render() {

        let error_message = null;
        if (this.state.error) {
            switch (this.state.error.code) {
                case ERROR_MIDI_NOT_SUPPORTED :
                    error_message = 'Your browser does not support Web MIDI. We recommend Chrome browser.';
                    break;
                case ERROR_MIDI_NOT_ENABLED :
                    error_message = "You need to enable the access to MIDI devices in your browser. See Help for instructions.";
                    break;
                case ERROR_UNKNOWN :
                default:
                    error_message = "Unable to access MIDI. Unknown error.";
                    break;
            }
        }

        return (
            <div>
                {error_message &&
                <div className="error"><div>{error_message}</div></div>}
                <Ports togglePortHandler={this.togglePort} />
            </div>
        );
    }

}

export default inject('appState')(observer(MidiHandler));
