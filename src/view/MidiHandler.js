import React from "react";
import {inject, observer} from "mobx-react";
import Midi, {ERROR_MIDI_NOT_ENABLED, ERROR_MIDI_NOT_SUPPORTED, ERROR_UNKNOWN} from "./Midi";
import PortsGrid from "./PortsGrid";
import "./MidiHandler.css";

const RECEIVE_MSG_TYPES = "midimessage";  // only receive sysex messages

class MidiHandler extends React.Component {

    state = {
        error: null
    };

    onMidiError = (error) => {
        this.setState({error})
    };

    onInputConnection = (port_id) => {
        if (global.dev) console.log("MidiHandler.onInputConnection", port_id);
        this.props.appState.setMidiInput(port_id);
    };

    onInputDisconnection = () => {
        this.props.appState.setMidiInput(null);
    };

    // onOutputConnection = (port_id) => {
    //     if (global.dev) console.log("MidiHandler.onOutputConnection", port_id);
    //     this.props.appState.setMidiOutput(port_id);
    // };

    // onOutputDisconnection = () => {
    //     this.props.appState.setMidiOutput(null);
    // };

    handleMidiInputEvent = (e) => {

        console.log(e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        // e.data is UInt8Array
        const S = this.props.appState;

        S.appendMessageIn(e);

        // const expected = this.props.appState.isExpected(e.data);
        // if (expected !== null) {
        //     S.device_ok = true;
        //     if (expected !== true) {
        //         if (global.dev) console.log("handleMidiInputEvent: expected msg can be ignored");
        //         return;
        //     }
        // }

        // sysex version: F0 7E 00 06 02 00 02 17 0B 0B 00 00 00 05 F7
        // if (e.data[0] === 0xF0 && e.data[1] === 0x7E) {
        //     let a = new Array(S.meta.length).fill(0);
        //     for (let i = 0, len = e.data.length; i < len; ++i) a[i] = e.data[i];
        //     S.meta = a;
        //     return;
        // }

        // if (!isSysexData(e.data)) {
        //     return;
        // }
        //
        // S.importSysexDump(e.data);
    };

    // toggleMidiConsole = () => {
    //     this.props.toggleMidiConsole();
    // };

    render() {

        const S = this.props.appState;

        const deviceInputPortID = S.device_ok ? S.midi.input : null;
        // const deviceOutputPortID = S.device_ok ? S.midi.output : null;

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
            <div className="Xsubheader-left">
                {error_message &&
                <div className="error"><div>{error_message}</div></div>}
                <Midi portsRenderer={(groupedPorts, togglePortHandler) =>
                        <PortsGrid
                            groupedPorts={groupedPorts}
                            togglePortHandler={togglePortHandler}
                            deviceInputPortID={deviceInputPortID}
                        />}
                    messageType={RECEIVE_MSG_TYPES}
                    onError={this.onMidiError}
                    onMidiInputEvent={this.handleMidiInputEvent}
                    onInputConnection={this.onInputConnection}
                    onInputDisconnection={this.onInputDisconnection} />
            </div>
        );
    }

}

export default inject('appState')(observer(MidiHandler));
