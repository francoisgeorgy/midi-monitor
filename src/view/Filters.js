import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Filters.css";
import Channels from "./Channels";

class Filters extends React.Component {

    render() {

        const F = this.props.appState.show;

        return (
            <div className="filters">

                <div className="filters-toggle" onClick={() => this.props.appState.toggleShowFilters()}>
                    {this.props.appState.showFilters ? 'hide' : 'show'} filters
                </div>

                {this.props.appState.showFilters &&
                <Fragment>
                    <div className="title first">
                        Columns:
                    </div>
                    <div className="filters-grid">
                        {/*<div>*/}
                            <label>
                                <input type="checkbox" checked={F.time} onChange={() => this.props.appState.toggleShowOption('time')} />Time
                            </label>
                        {/*</div>*/}
                        {/*<div>*/}
                            <label>
                                <input type="checkbox" checked={F.source} onChange={() => this.props.appState.toggleShowOption('source')} />Source
                            </label>
                        {/*</div>*/}
                        <div>
                            Data
                            <input type="checkbox" checked={F.dataHex} onChange={() => this.props.appState.toggleShowOption('dataHex')} />hex
                            <input type="checkbox" checked={F.dataDec} onChange={() => this.props.appState.toggleShowOption('dataDec')} />dec
                        </div>
                    </div>

                    <div className="title">
                        Channel messages:
                    </div>
                    <div className="filters-grid">
                        <label>
                            <input type="checkbox" checked={F.voice} onChange={() => this.props.appState.toggleShowOption('voice')} />Voice
                        </label>
                        <label>
                            <input type="checkbox" checked={F.mode} onChange={() => this.props.appState.toggleShowOption('mode')} />Mode
                        </label>
                    </div>

                    <div className="title">
                        System messages:
                    </div>
                    <div className="filters-grid">
                        <label>
                            <input type="checkbox" checked={F.sysex} onChange={() => this.props.appState.toggleShowOption('sysex')} />System Exclusive
                        </label>
                        <label>
                            <input type="checkbox" checked={F.common} onChange={() => this.props.appState.toggleShowOption('common')} />System Common
                        </label>
                        <label>
                            <input type="checkbox" checked={F.realtime} onChange={() => this.props.appState.toggleShowOption('realtime')} />Real Time
                        </label>
                    </div>

                    <Channels />
                </Fragment>}

            </div>
        );
    }
}

export default inject('appState')(observer(Filters));
