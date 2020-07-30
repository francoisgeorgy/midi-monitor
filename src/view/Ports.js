import React, {Fragment} from 'react';
import Switch from "react-switch";
import {inject, observer} from "mobx-react";
import "./Ports.css";

class Ports extends React.Component {

    //TODO: for each port: clearMessages, toggleMessages, setColor, mute, solo (mute all the others that are not solo), ignore, resetCounter

    toggleMuted = (port_id) => {
        this.props.appState.toggleMuted(port_id);
    };

    toggleSolo = (port_id) => {
        this.props.appState.toggleSolo(port_id);
    };

    toggleVisibility = (port_id) => {
        this.props.appState.toggleVisibility(port_id);
    };

    render() {
        const {togglePortHandler} = this.props;
        const ports = this.props.appState.midi.inputs;

        //TODO: if there is at least one port soloed, then only show the soloed ports.

        if (ports) {
            return (
                <div className="ports-wrapper">
                    <div className="title">Devices:</div>
                <div className="ports-grid">{
                    Object.keys(ports).map(port_id => {
                        const port = ports[port_id];
                        if (port) {
                            // console.log("Ports", port_id);
                            return (
                                <div className={`port ${port.enabled ? 'enabled' : ''}`} key={port_id}
                                     onClick={() => togglePortHandler(port_id)}>
                                    <div className="port-switch" onClick={(e) => e.stopPropagation()}>
                                        <Switch onChange={() => togglePortHandler(port_id)}
                                                checked={port.enabled}
                                                id={`switch-${port_id}`}
                                                className="react-switch"
                                                height={16} width={36} />
                                    </div>
                                    <div className="port-manufacturer">{port.manufacturer || 'unknown man.'}</div>
                                    <div className="port-name">{port.name}</div>
{/*
                                    <div className="port-options">
                                        <div className={`port-option-trigger ${port.muted ? 'on' : ''}`}
                                             onClick={(e) => {e.stopPropagation();this.toggleMuted(port_id)}}
                                             title="Mute. Do not record messages when this is on.">M</div>
                                        <div className={`port-option-trigger ${port.solo ? 'on' : ''}`}
                                             onClick={(e) => {e.stopPropagation();this.toggleSolo(port_id)}}
                                             title="Solo. Only soloed ports will record messages when this is on.">S</div>
                                        <div className={`port-option-trigger ${port.hidden ? 'warn' : ''}`}
                                             onClick={(e) => {e.stopPropagation();this.toggleVisibility(port_id)}}
                                             title="Hide or show the messages (but continues to record them).">{port.hidden ? 'hidden' : 'hide'}</div>
                                        <div className="port-messages" title="Number of messages received on this port since the last clear.">{port.nb_messages}</div>
                                    </div>
*/}
                                </div>);
                        } else {
                            return null;
                        }
                    })
                }</div>
                </div>
            );
        } else {
            console.log("Ports: this.props.appState.inputs is null");
            return null;
        }
    }

}

export default inject('appState')(observer(Ports));
