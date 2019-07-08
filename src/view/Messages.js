import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import {hs} from "../utils/hexstring";
import "./Messages.css";

class Messages extends React.Component {

    clear = () => {
        this.props.appState.messages = [];   // parseMidi() messages with additional .timestamp property
    };

    toggleFull = (index) => {
        if (global.dev) console.log("togglefull", index);
        this.props.appState.messages[index].view_full = !this.props.appState.messages[index].view_full;
    };

    scrollToBottom = () => {
        if (this.props.consolePosition === 'bottom') return;
        this.messagesEnd.scrollIntoView();
    };

    componentDidMount() {
        this.scrollToBottom();
    };

    componentDidUpdate() {
        this.scrollToBottom();
    };

    render() {

        const {consolePosition} = this.props;

        const cut_len = consolePosition === 'bottom' ? 48 : 12;

        return (
            <div className="messages midi-console">
                <div className="panel-title">
                    MIDI&nbsp;monitor
                    <button type="button" className="btn btn-light btn-small" onClick={this.clear}>Clear messages</button>
                </div>
                <div className="content-wrapper">
                    {/*<div className="instruction">Sent and received MIDI messages. Use it to test your configuration.</div>*/}
                    <table>
                        <tbody>
                        <tr>
                            {/*<th>timestamp</th>*/}
                            <th>dir.</th>
                            <th>source</th>
                            <th>msg type</th>
                            <th>ch.</th>
                            <th>data1</th>
                            <th>data2</th>
                            <th>raw data (hex)</th>
                        </tr>
                        {this.props.appState.messages && this.props.appState.messages.map((m, i) =>
                        <tr key={i}>
                            {/*<td>{m.timestamp.toFixed(3)}</td>*/}
                            <td>{m.direction}</td>
                            <td>{m.source}</td>
                            {!m.sysex &&
                            <Fragment>
                                <td className="data-txt">{m.type}</td>
                                <td className="data">{m.channel}</td>
                                <td className="data">{m.data1}</td>
                                <td className="data">{m.data2}</td>
                                <td className="data">{hs(m.data)}</td>
                            </Fragment>
                            }
                            {m.sysex &&
                            <Fragment>
                                <td className="data-txt" colSpan={2}>{m.type}</td>
                                {m.data.length <= cut_len &&
                                <td className="data" colSpan={3}>{hs(m.data)}</td>
                                }
                                {m.data.length > cut_len &&
                                <td className="data" colSpan={3}>{hs(m.view_full ? m.data : m.data.slice(0, cut_len))} <span className="toggle_full" onClick={() => this.toggleFull(i)}>{m.view_full ? 'less' : 'full'}</span></td>
                                }
                            </Fragment>
                            }
                        </tr>
                        )}
                        </tbody>
                    </table>
                    {consolePosition !== 'bottom' &&
                    <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}>
                    </div>}
                </div>
            </div>
        );
    }
}

// https://github.com/mobxjs/mobx-react/issues/250
export default inject('appState')(observer(Messages));
