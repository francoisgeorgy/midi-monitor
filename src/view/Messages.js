import React from "react";
import {inject, observer} from "mobx-react";
import {ds, hs} from "../utils/hexstring";
import "./Messages.css";

class Messages extends React.Component {

/*
    clear = () => {
        this.props.appState.messages = [];   // parseMidi() messages with additional .timestamp property
    };

    toggleFull = (index) => {
        if (global.dev) console.log("togglefull", index);
        this.props.appState.messages[index].view_full = !this.props.appState.messages[index].view_full;
    };
*/

    scrollToBottom = () => {
        // const t = document.getElementById("mytable");
        // console.log(t.offsetHeight);
        // window.scrollTo(0, t.offsetHeight);
        this.messagesEnd.scrollIntoView();
    };

    componentDidMount() {
        this.scrollToBottom();
    };

    componentDidUpdate() {
        this.scrollToBottom();
    };

    //
    // Display format:
    //
    // # | source | data (hex) | data (dec) | type | channel | decoded | commands (e.g. export sysex)
    //

    render() {

        // const {consolePosition} = this.props;

        // const cut_len = consolePosition === 'bottom' ? 48 : 12;

        //TODO: add a filter row

        return (
            <table>
                <tbody>
                <tr>
                    <th className="midi-time">time delta</th>
                    <th>source</th>
                    <th>raw data (hex)</th>
                    <th>raw data (dec)</th>
                    <th>msg type</th>
                    <th className="midi-ch">ch.</th>
                    <th>data1</th>
                    <th>data2</th>
                </tr>
                <tr>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="search" placeholder="filter"  value="example" className="active" /></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                    <th className="filter"><input type="text" placeholder="filter"/></th>
                </tr>
                {this.props.appState.messages && this.props.appState.messages.map((m, i) =>
                <tr key={i}>
                    {/*<td className="ra">{m.timestamp.toFixed(3)}</td>*/}
                    <td className="midi-time ra">{m.timedelta.toFixed(3)}</td>
                    <td>{m.source}</td>
                    <td className="data">{hs(m.data)}</td>
                    <td className="data">{ds(m.data)}</td>
                    <td className="data-txt nw">{m.type}</td>
                    <td className="data midi-ch">{m.channel}</td>
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
                <tr ref={(el) => { this.messagesEnd = el; }}>
                </tr>
                </tbody>
            </table>
        );
    }
}

// https://github.com/mobxjs/mobx-react/issues/250
export default inject('appState')(observer(Messages));
