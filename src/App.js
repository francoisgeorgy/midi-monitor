import React, {Component, Fragment} from 'react';
import {Provider} from "mobx-react";
import {appState} from "./state/State";
import MidiHandler from "./view/MidiHandler";
import Header from "./view/Header";
import Messages from "./view/Messages";
import './App.css';

const DEFAULT_CONSOLE_POSITION = 'left';
const DEFAULT_HELP_POSITION = 'right';

class App extends Component {

    state = {
        dropZoneActive: false,
        consoleActive: false,
        consolePosition: DEFAULT_CONSOLE_POSITION,
        helpPosition: DEFAULT_HELP_POSITION,
        help: false
    };

/*
    componentDidMount(){
        const s = loadPreferences();
        this.setState(
            {
                consoleActive: s.midi_console || false,
                consolePosition: s.midi_console_position || DEFAULT_CONSOLE_POSITION,
                help: s.help || false,
                helpPosition: s.help_position || DEFAULT_HELP_POSITION
            }
        );
    }
*/

    render() {

        if (global.dev) console.info(process.env.REACT_APP_NAME, process.env.REACT_APP_VERSION);

        return (
            <Provider appState={appState}>
                <Fragment>
                    {/*<div className="top">Fixed Top</div>*/}
                    <Header />
                    <div className="app">
                        <div className="left">
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
