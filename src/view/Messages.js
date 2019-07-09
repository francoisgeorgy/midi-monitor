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

    // scrollToBottom = () => {
    //     if (this.props.consolePosition === 'bottom') return;
    //     this.messagesEnd.scrollIntoView();
    // };

    // componentDidMount() {
    //     this.scrollToBottom();
    // };
    //
    // componentDidUpdate() {
    //     this.scrollToBottom();
    // };

    //
    // Display format:
    //
    // # | source | data (hex) | data (dec) | type | channel | decoded | commands (e.g. export sysex)
    //

    render() {

        const {consolePosition} = this.props;

        const cut_len = consolePosition === 'bottom' ? 48 : 12;

        return (
                    <table>
                        <tbody>
                        <tr>
                            {/*<th>timestamp</th>*/}
                            {/*<th>dir.</th>*/}
                            <th>source</th>
                            <th>raw data (hex)</th>
                            <th>raw data (dec)</th>
                            <th>msg type</th>
                            <th>ch.</th>
                            <th>data1</th>
                            <th>data2</th>
                        </tr>
                        {this.props.appState.messages && this.props.appState.messages.map((m, i) =>
                        <tr key={i}>
                            {/*<td>{m.timestamp.toFixed(3)}</td>*/}
                            {/*<td>{m.direction}</td>*/}
                            <td>{m.source}</td>
                            <td className="data">{hs(m.data)}</td>
                            <td className="data">{hs(m.data)}</td>
                            <td className="data-txt">{m.type}</td>
                            <td className="data">{m.channel}</td>
                            <td className="data">{m.data1}</td>
                            <td className="data">{m.data2}</td>
                            {/* m.sysex &&
                            <Fragment>
                                <td className="data-txt" colSpan={2}>{m.type}</td>
                                {m.data.length <= cut_len &&
                                <td className="data" colSpan={3}>{hs(m.data)}</td>
                                }
                                {m.data.length > cut_len &&
                                <td className="data" colSpan={3}>{hs(m.view_full ? m.data : m.data.slice(0, cut_len))} <span className="toggle_full" onClick={() => this.toggleFull(i)}>{m.view_full ? 'less' : 'full'}</span></td>
                                }
                            </Fragment>
                            */}
                        </tr>
                        )}
                        </tbody>
                    </table>
        );
    }
}

// https://github.com/mobxjs/mobx-react/issues/250
export default inject('appState')(observer(Messages));