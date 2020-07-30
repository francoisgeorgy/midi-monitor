import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Channels.css";

class Channels extends React.Component {



    render() {

        const F = this.props.appState.filters;

        return (
            <div>
                <div className="channels-toggles">
                <div onClick={() => this.props.appState.selectAllChannels()}>all</div>
                <div onClick={() => this.props.appState.unselectAllChannels()}>none</div>
                </div>
                <div className="channels">
                    {F.channels.map((c, i) =>
                        <div key={i} className={c ? 'on' : ''} onClick={() => {F.channels[i] = !F.channels[i]}}>{i+1}</div>
                    )}
                </div>
            </div>
        );
    }
}

export default inject('appState')(observer(Channels));
