import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import * as WebMidi from "webmidi";
import {inputById, portById} from "../utils/ports";
import {loadPreferences, savePreferences} from "../utils/preferences";
import {produce} from "immer";

const propTypes = {
    classname: PropTypes.string,
    portsRenderer: PropTypes.func,
    messageType: PropTypes.string,
    onMidiInputEvent: PropTypes.func,
    onInputConnection: PropTypes.func,      // callback with port.id as parameter
    onInputDisconnection: PropTypes.func,   // callback with port.id as parameter
    children: PropTypes.node
};

const defaultProps = {
    classname: "",
    messageType: "midimessage"
};

// const ERROR_NO_ERROR = -1;
export const ERROR_MIDI_NOT_SUPPORTED = 1;
export const ERROR_MIDI_NOT_ENABLED = 2;
export const ERROR_UNKNOWN = 3;

/**
 *
 * @param props
 * @constructor
 */
export default class Midi extends Component {

    //TODO: allow specification of channel and message types to listen to

/*
    state = {
        inputs: {}         // key = port.id; array of MIDI inputs (filtered from WebMidi object)
        // input: null,        // MIDI input port ID
    };
*/

    connectInput = port => {
        if (this.props.onMidiInputEvent) {
            if (port) {
                if (global.dev) console.log(`Midi.connectInput: connect input ${port.id}`);
                if (port.hasListener(this.props.messageType, 'all', this.props.onMidiInputEvent)) {
                    console.warn(`Midi.connectInput: sysex messages on all channels listener already connected`);
                } else {
                    if (global.dev) console.log(`Midi.connectInput: add listener for sysex messages on all channels`);
                    port.addListener(this.props.messageType, 'all', this.props.onMidiInputEvent);
                    if (this.props.onInputConnection) {
                        this.props.onInputConnection(port.id);
                    }
                    if (global.dev) console.log("Midi.connectInput: ", port.name);
                    //FIXME: preferences
                    // if (global.dev) console.log(`Midi.connectInput: set input input_device_id=${port.id} in preferences`);
                    // savePreferences({input_device_id: port.id});

                    // this.setState({input: port.id});
                    this.setState(produce(draft => draft.inputs[port.id].enable = true));
                }
            }
        }
    };

    disconnectInput = (port, updatePreferences=false) => {
        // if (port.id === this.state.input) {
            if (global.dev) console.log(`Midi.disconnectInput: disconnect input ${port.id}`);
            if (port.removeListener) port.removeListener();

            // this.setState({input: null});
            this.setState(produce(draft => draft.inputs[port.id].enable = false));

            if (this.props.onInputDisconnection) {
                this.props.onInputDisconnection(port.id);
            }
            //FIXME: preferences
            // if (global.dev) console.log(`Midi.connectInput: connect input set input_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({input_device_id: null});
        // }
    };

    autoConnectInput = (port_id) => {
        if (global.dev) console.log(`Midi.autoConnectInput ${port_id} ?`);
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

    registerInput = (port_id) => {
        if (global.dev) console.log(this.state.inputs.length === 0 ? 'Midi.addInput register inputs' : 'Midi.addInput update inputs list');
        this.setState(
            produce(draft => {
                if (!draft.inputs.hasOwnProperty(port.id)) {
                    draft.inputs[port.id] = {
                        name: port.name,
                        enable: false
                    }
                }
                // for (let port of WebMidi.inputs) {
                //     if (!draft.inputs.hasOwnProperty(port.id)) {
                //         draft.inputs[port.id] = {
                //             name: port.name,
                //             enable: false
                //         }
                //     }
                // }
            }),
            () => {
                if (global.dev) console.log("Midi.addInput: try to autoconnect input");
                // noinspection JSUnresolvedVariable
                this.autoConnectInput(port_id)
            }
        );
/*
        this.setState(
            // noinspection JSUnresolvedVariable

            {inputs: WebMidi.inputs},
            () => {
                if (global.dev) console.log("Midi.addInput: try to autoconnect input");
                // noinspection JSUnresolvedVariable
                for (let port of WebMidi.inputs) {
                    this.autoConnectInput(port.id)
                }
            });
*/
    };

    unRegisterInputs = () => {
        if (global.dev) console.log("Midi.unRegisterInputs");

        //FIXME: disconnect all connected inputs
        this.disconnectInput(portById(this.state.input));

        this.setState({inputs: {}});
    };

    handleMidiConnectEvent = e => {
        if (global.dev) console.log(`Midi: handleMidiConnectEvent: ${e.port.type} ${e.type} ${e.port.state}: ${e.port.name} ${e.port.id}`, e);
        if (e.port.type === "input") {
            if (e.type === "disconnected") {
                this.disconnectInput(e.port);
            }
            if (global.dev) console.log("Midi.handleMidiConnectEvent: call addInput");
            this.registerInput(e.port.id);
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
            if (this.props.onError) {
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
                this.props.onError({code, message: err.message});
            }
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
            this.registerInput();
            // this.registerOutputs();
        } else {
            if (global.dev) console.log("Midi: component did mount: Calling WebMidi.enable");
            // noinspection JSUnresolvedFunction
            WebMidi.enable(this.midiOn, true);  // true to enable sysex support
        }
    }

    componentWillUnmount() {
        if (global.dev) console.log("Midi: component will unmount: unregister ports");
        this.unRegisterInputs();
        // this.unRegisterOutputs();
    }

    /**
     *
     * @param port_id
     */
    togglePort = (port_id) => {

        let p = portById(port_id);

        if (global.dev) console.log(`toggle ${p.type} ${port_id}`);

        if (this.state.inputs[port_id].enabled) {
            this.disconnectInput(portById(port_id), true);
        } else {
            this.connectInput(inputById(port_id));
        }

/*
        if (p.type === 'input') {
            let prev = this.state.input;
            if (this.state.input) {
                this.disconnectInput(portById(this.state.input), true);
            }
            if (port_id !== prev) {
                this.connectInput(inputById(port_id));
            }
        }
*/
    };

/*
    portsGrouped = () => {
        let group = {};
        // noinspection JSUnresolvedVariable
        for (let port of WebMidi.inputs) {
            group[port.name] = {
                input: {
                    id: port.id,
                    selected: port.id === this.state.input
                }   //,
                // output: null
            };
        }
        // noinspection JSUnresolvedVariable
        // for (let port of WebMidi.outputs) {
        //     if (!(port.name in group)) {
        //         group[port.name] = {
        //             input: null,
        //             output: null
        //         };
        //     }
        //     group[port.name].output = {
        //         id: port.id,
        //         selected: port.id === this.state.output
        //     }
        // }
        return group;
    };
*/
    ports = () => {
        let group = {};
        // noinspection JSUnresolvedVariable
        for (let port of WebMidi.inputs) {
            group.push({
                port,
                selected: port.id === this.state.input
                //TODO: other props like "silent", ...
            });
        }
        // noinspection JSUnresolvedVariable
        // for (let port of WebMidi.outputs) {
        //     if (!(port.name in group)) {
        //         group[port.name] = {
        //             input: null,
        //             output: null
        //         };
        //     }
        //     group[port.name].output = {
        //         id: port.id,
        //         selected: port.id === this.state.output
        //     }
        // }
        return group;
    };

    render() {
        return (
            <Fragment>
                {this.props.portsRenderer(this.ports(), this.togglePort)}
            </Fragment>
        );
    }

}

Midi.propTypes = propTypes;
Midi.defaultProps = defaultProps;
