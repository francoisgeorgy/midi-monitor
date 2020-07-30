import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Filters.css";
import Channels from "./Channels";

class Filters extends React.Component {

    render() {

        const F = this.props.appState.show;

        return (
            <Fragment>
                <div className="filters">
                    <div>
                        Show Hide filters
                    </div>
                    <div className="title">
                        Columns:
                    </div>
                    <div className="filters-grid">
                        <div>
                            <label>
                                <input type="checkbox" checked={F.time} onChange={() => this.props.appState.toggleShowOption('time')} />Time
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={F.source} onChange={() => this.props.appState.toggleShowOption('source')} />Source
                            </label>
                        </div>
                        <div>
                            Data
                            <input type="checkbox" checked={F.dataHex} onChange={() => this.props.appState.toggleShowOption('dataHex')} />hex
                            <input type="checkbox" checked={F.dataDec} onChange={() => this.props.appState.toggleShowOption('dataDec')} />dec
                        </div>
                    </div>
                    <div className="title">
                        Messages:
                    </div>
                    <div className="filters-grid">
                        <div>
                            <label>
                                <input type="checkbox" checked={F.realtime} onChange={() => this.props.appState.toggleShowOption('realtime')} />Real-time
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={F.sysex} onChange={() => this.props.appState.toggleShowOption('sysex')} />System exclusive
                            </label>
                        </div>
                        <Channels />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default inject('appState')(observer(Filters));
