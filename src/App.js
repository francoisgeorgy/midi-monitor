import React, {Component, Fragment} from 'react';
import {Provider} from "mobx-react";
import {appState} from "./state/State";
import MidiHandler from "./view/MidiHandler";
import Header from "./view/Header";
import Messages from "./view/Messages";
import './App.css';
import Filters from "./view/Filters";
import {MidiSupportWarning} from "./view/MidiSupportWarning";

class App extends Component {

    render() {
        if (global.dev) console.info(process.env.REACT_APP_NAME, process.env.REACT_APP_VERSION);
        return (
            <Provider appState={appState}>
                <Fragment>
                    <MidiSupportWarning />
                    <Header />
                    <div className="app">
                        <div className="left">
                            <Filters />
                            <MidiHandler />
                        </div>
                        <div className="right">
                            <Messages />
                        </div>
                    </div>
                </Fragment>
            </Provider>
        );
    }
}

export default App;
