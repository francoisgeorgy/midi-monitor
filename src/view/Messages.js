import React from "react";
import {inject, observer} from "mobx-react";
import "./Messages.css";
import {produce} from "immer";

const FILTER_GLOBAL = 'global';
const FILTER_TIME = 'time';
const FILTER_SOURCE = 'source';
const FILTER_RAW_HEX = 'raw_hex';
const FILTER_RAW_DEC = 'raw_dec';
const FILTER_MSG_TYPE = 'msg_type';
const FILTER_CH = 'ch';
const FILTER_INFOS = 'infos';


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
    state = {
        filter: {
            [FILTER_GLOBAL]: '',
            [FILTER_TIME]: '',
            [FILTER_SOURCE]: '',
            [FILTER_RAW_HEX]: '',
            [FILTER_RAW_DEC]: '',
            [FILTER_MSG_TYPE]: '',
            [FILTER_CH]: '',
            [FILTER_INFOS]: ''
        }
    };

    setFilter(filter, value) {
        this.setState(produce(
            draft => {draft.filter[filter] = value}
        ));
    }

    scrollToBottom = () => {
        // const t = document.getElementById("mytable");
        // console.log(t.offsetHeight);
        // window.scrollTo(0, t.offsetHeight);
        this.messagesEnd.scrollIntoView();
    };

    componentDidMount() {
        // not necessary if displayed in reverse chronological order
        if (false) this.scrollToBottom();
    }

    componentDidUpdate() {
        // not necessary if displayed in reverse chronological order
        if (false) this.scrollToBottom();
    }

    //
    // Display format:
    //
    // # | source | data (hex) | data (dec) | type | channel | decoded | commands (e.g. export sysex)
    //

    render() {

        // const {consolePosition} = this.props;

        // const cut_len = consolePosition === 'bottom' ? 48 : 12;

        //TODO: add a filter row

        const f = this.state.filter;

        const S = this.props.appState;

        //TODO: separate channel messages and global messages

        // TODO: case insensitive filter
        // TODO: regex filter
        const filtered =
            this.props.appState.messages &&
            this.props.appState.messages.filter(
                m => {
                    let b =
                        (f[FILTER_RAW_HEX] === '' ? true : m.raw_hex.includes(f[FILTER_RAW_HEX])) &&
                        (f[FILTER_RAW_DEC] === '' ? true : m.raw_dec.includes(f[FILTER_RAW_DEC])) &&
                        (f[FILTER_TIME] === '' ? true : m.time_delta.includes(f[FILTER_TIME])) &&
                        (f[FILTER_SOURCE] === '' ? true : m.source.includes(f[FILTER_SOURCE])) &&
                        (f[FILTER_MSG_TYPE] === '' ? true : m.type.includes(f[FILTER_MSG_TYPE]));   // &&
                        // (f[FILTER_INFOS] === '' ? true : m.info.includes(f[FILTER_INFOS])) &&
                        // (f[FILTER_CH] === '' ? true : m.channel.includes(f[FILTER_CH]));
                    return b;
                });

        return (
            <table>
                <tbody>
                <tr>
                    {S.show.time && <th className="midi-time">time delta (ms)</th>}
                    {S.show.source && <th>source</th>}
                    {S.show.dataHex && <th>data (hex)</th>}
                    {S.show.dataDec && <th>data (dec)</th>}
                    <th className="midi-ch">ch.</th>
                    <th>message</th>
                    {/*<th>note</th>*/}
                    {/*<th>CC</th>*/}
                    {/*<th>other</th>*/}
                    {/*<th>data2</th>*/}
                </tr>
{/*
                <tr>
                    <th className="filter midi-time"><input type="text" placeholder="filter" value={f[FILTER_TIME]} onChange={(e) => this.setFilter(FILTER_TIME, e.target.value)} /></th>
                    <th className="filter"><input type="text" placeholder="filter" value={f[FILTER_SOURCE]} onChange={(e) => this.setFilter(FILTER_SOURCE, e.target.value)} /></th>
                    <th className="filter"><input type="text" placeholder="filter" value={f[FILTER_RAW_HEX]} onChange={(e) => this.setFilter(FILTER_RAW_HEX, e.target.value)} /></th>
                    <th className="filter"><input type="text" placeholder="filter" value={f[FILTER_RAW_DEC]} onChange={(e) => this.setFilter(FILTER_RAW_DEC, e.target.value)} /></th>
                    <th className="filter midi-ch"></th>
                    <th className="filter"><input type="text" placeholder="filter" value={f[FILTER_MSG_TYPE]} onChange={(e) => this.setFilter(FILTER_MSG_TYPE, e.target.value)} /></th>
                </tr>
*/}
                {filtered && filtered.map((m, i) =>
                <tr key={i}>
                    {/*<td className="ra">{m.timestamp.toFixed(3)}</td>*/}
                    {S.show.time && <td className="midi-time ra">{m.time_delta}</td>}
                    {S.show.source && <td className="nw">{m.source}</td>}
                    {S.show.dataHex && <td className="data" dangerouslySetInnerHTML={{__html: m.raw_hex}}/>}
                    {S.show.dataDec && <td className="data" dangerouslySetInnerHTML={{__html: m.raw_dec}}/>}
                    <td className="midi-ch">{m.channel}</td>
                    <td className="data">{m.info}</td>

                    {/*TODO: sysex: in column info, add link to download sysex as file */}

                    {/*<td className="data data-note">{m.info_note}</td>*/}
                    {/*<td className="data data-cc">{m.info_cc}</td>*/}
                    {/*<td className="data data-info">{m.info}</td>*/}
                    {/*<td className="data data-byte">{m.data1} {m.data2}</td>*/}
                    {/*<td className="data data-byte">{m.data2}</td>*/}
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
