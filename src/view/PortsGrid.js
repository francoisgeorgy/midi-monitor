import React from 'react';
import "./PortsGrid.css";
import {inject, observer} from "mobx-react";

class PortsGrid extends React.Component {

    render() {
        const ports = this.props.appState.midi.inputs;
        if (ports) {
            return (
                <div className="ports-grid">{
                    Object.keys(ports).map((port_id, index) => {
                        const port = ports[port_id];
                        // const checked = groupedPorts[name].input.selected;
                        // const id = `switch-${groupedPorts[name].input.id}`;
                        if (port) {
                            console.log("PortsGrid", port_id);
                            return (
                                <div className={`port ${port.enabled ? 'enabled' : ''}`} key={port_id}
                                     onClick={() => this.props.togglePortHandler(port_id)}>
                                    <div className="port-manufacturer">manufacturer</div>
                                    <div className="port-name">{port.name}</div>
                                    <div className="port-options">
                                        <div>color</div>
                                        <div>hide</div>
                                        <div className="port-messages">1234</div>
                                    </div>
                                </div>);
                        } else {
                            return null;
                        }
                    })
                }</div>
            );
        } else {
            console.log("PortsGrids: this.props.appState.inputs is null");
            return null;
        }
    }

}

/*
                                groupedPorts[name].input &&
                        <div className="port-switch">
                            <Switch onChange={() => togglePortHandler(groupedPorts[name].input.id)}
                                    checked={groupedPorts[name].input.selected} id={`switch-${groupedPorts[name].input.id}`}
                                    className="react-switch"
                                    height={16} width={36}/>
                            <div>
                                1234
                            </div>
                        </div>
 */

export default inject('appState')(observer(PortsGrid));
