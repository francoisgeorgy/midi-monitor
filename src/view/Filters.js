import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Filters.css";
import Channels from "./Channels";

class Filters extends React.Component {

    render() {

        const F = this.props.appState.filters;

        return (
            <Fragment>
                <div className="filters">
                    <div className="title">
                        Show:
                    </div>
                    <div className="filters-grid">
                        <div>
                            <label>
                                <input type="checkbox" checked={F.realtime}
                                       onChange={() => F.realtime = !F.realtime} />Time
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={F.realtime}
                                       onChange={() => F.realtime = !F.realtime} />Source
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={F.realtime}
                                       onChange={() => F.realtime = !F.realtime} />Data hex dec
                            </label>
                        </div>
                    </div>
                    <div className="xtitle">
                        messages:
                    </div>
                    <div className="filters-grid">
                        <div>
                            <label>
                                <input type="checkbox" checked={F.realtime}
                                       onChange={() => F.realtime = !F.realtime} />Real-time
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={F.sysex}
                                       onChange={() => F.sysex = !F.sysex} />System exclusive
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
