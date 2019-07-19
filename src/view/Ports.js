import React from 'react';
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

    render() {
        const {togglePortHandler} = this.props;
        const ports = this.props.appState.midi.inputs;
        if (ports) {
            return (
                <div className="ports-grid">{
                    Object.keys(ports).map((port_id, index) => {
                        const port = ports[port_id];
                        if (port) {
                            // console.log("Ports", port_id);
                            return (
                                <div className={`port ${port.enabled ? 'enabled' : ''}`} key={port_id}
                                     onClick={() => togglePortHandler(port_id)}>
                                    <div className="port-switch">
                                        <Switch onChange={() => togglePortHandler(port_id)}
                                                checked={port.enabled}
                                                id={`switch-${port_id}`}
                                                className="react-switch"
                                                height={16} width={36} />
                                    </div>
                                    <div className="port-manufacturer">{port.manufacturer || 'unknown man.'}</div>
                                    <div className="port-name">{port.name}</div>
                                    <div className="port-options">
                                        <div className={`port-option-trigger ${port.muted ? 'on' : ''}`} onClick={() => this.toggleMuted(port_id)} title="Mute">M</div>
                                        <div className={`port-option-trigger ${port.solo ? 'on' : ''}`} onClick={() => this.toggleSolo(port_id)} title="Solo">S</div>
                                        <div className={`port-option-trigger ${port.visible ? 'on' : ''}`} onClick={() => this.toggleVisibility(port_id)} title="Visibility">V</div>
                                        {/*<div>color</div>*/}
                                        {/*<div>hide</div>*/}
                                        <div className="port-messages">{port.nb_messages}</div>
                                    </div>
                                </div>);
                        } else {
                            return null;
                        }
                    })
                }</div>
            );
        } else {
            console.log("Ports: this.props.appState.inputs is null");
            return null;
        }
    }

}

export default inject('appState')(observer(Ports));
