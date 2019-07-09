import React from 'react';
import "./PortsGrid.css";

const PortsGrid = ({ groupedPorts, togglePortHandler, deviceInputPortID }) => {
    return (
        <div className="ports-grid">
            {Object.keys(groupedPorts).map((name, index) => {
                const checked = groupedPorts[name].input.selected;
                const id = `switch-${groupedPorts[name].input.id}`;
                return (
                    <div className={`port ${checked ? 'enabled' : ''}`} key={index} onClick={() => togglePortHandler(groupedPorts[name].input.id)}>
                        <div className="port-manufacturer">manufacturer</div>
                        <div className="port-name">{name}</div>
                        <div className="port-options">
                            <div>color</div>
                            <div>hide</div>
                            <div className="port-messages">1234</div>
                        </div>
                        {/* groupedPorts[name].input &&
                        <div className="port-switch">
                            <Switch onChange={() => togglePortHandler(groupedPorts[name].input.id)}
                                    checked={groupedPorts[name].input.selected} id={`switch-${groupedPorts[name].input.id}`}
                                    className="react-switch"
                                    height={16} width={36}/>
                            <div>
                                1234
                            </div>
                        </div> */}
                    </div>)
                }
            )}
        </div>
    );

};

export default PortsGrid;
