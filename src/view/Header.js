import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Header.css";

class Header extends React.Component {

    clearMessages = ()  => {
        this.props.appState.clearMessages();
    };

    render() {

        return (
            <Fragment>
                <div className="header">

                    <div className="keep-last">
                        Keep the last <input type="text" size="4" value={this.props.appState.queue_size}
                                             onChange={(e) => this.props.appState.setQueueSize(parseInt(e.target.value, 10))}/> messages.
                    </div>

                    <div className="middlec-selector">
                        Middle C (60) octave:
                        <select value={this.props.appState.octaveMiddleC} onChange={(e) => this.props.appState.setOctaveMiddleC(parseInt(e.target.value, 10))}>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>

                    <div className="pitchbend-selector">
                        Pitch Bend range:
                        <select value={this.props.appState.bendRange} onChange={(e) => this.props.appState.setBendRange(parseInt(e.target.value, 10))}>
                            <option value={1}>&plusmn; 1</option>
                            <option value={2}>&plusmn; 2</option>
                            <option value={12}>&plusmn; 12</option>
                            <option value={24}>&plusmn; 24</option>
                            <option value={48}>&plusmn; 48</option>
                        </select>
                    </div>

                    <button className="clear-button" onClick={this.clearMessages}>CLEAR</button>

                    <a href="https://studiocode.dev/applications/midi-monitor/" target="_blank" rel="noopener noreferrer">Documentation</a>

                    <div className="about">
                        <span className="bold">MIDI Monitor {process.env.REACT_APP_VERSION}</span>
                        &nbsp;by&nbsp;<a href="https://studiocode.dev" target="_blank" rel="noopener noreferrer">StudioCode.dev</a>
                    </div>

                </div>
            </Fragment>
        );
    }
}

export default inject('appState')(observer(Header));
