import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import "./Header.css";
import Popup from "reactjs-popup";

class Header extends React.Component {

    // constructor(props) {
    //     super(props);
    // }


    help = ()  => {
        // let url = "index.html?help";
        // window.open(url, "_blank", "width=900,height=600,top=200,left=100,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no");
    };

    clearMessages = ()  => {
        this.props.appState.clearMessages();
    };

    render() {

        // const S = this.props.appState;

        return (
            <Fragment>
{/*
                <div className="pre-header">
                    <a href="https://sysex.io/">sysex.io</a>
                </div>
*/}
                <div className="header">
                    <div className="header-app-name">MIDI Monitor {process.env.REACT_APP_VERSION} by <a href="https://studiocode.dev/" target="_blank">StudioCode.dev</a></div>
{/*
                    <Popup trigger={<div className="header-app-name">MIDI Monitor {process.env.REACT_APP_VERSION} by <a href="https://studiocode.dev/" target="_blank">StudioCode.dev</a></div>} modal closeOnDocumentClick>
                        <div className="about">
                            <div className="about-title">MIDI Monitor {process.env.REACT_APP_VERSION}</div>
                            <div>Coding by <a href="https://sysex.io/" target="_blank" rel="noopener noreferrer">Fran&ccedil;ois Georgy</a></div>
                            <div className="about-deps">
                                <div>This application has been made possible thanks to the following libraries:</div>
                                <a href="https://github.com/immerjs/immer" target="_blank" rel="noopener noreferrer">immer</a>
                                <a href="https://mobx.js.org/" target="_blank" rel="noopener noreferrer">MobX</a>
                                <a href="https://github.com/mobxjs/mobx-react" target="_blank" rel="noopener noreferrer">mobx-react</a>
                                <a href="https://github.com/dlevs/parse-midi" target="_blank" rel="noopener noreferrer">parse-midi</a>
                                <br />
                                <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a>
                                <a href="https://react-popup.elazizi.com/" target="_blank" rel="noopener noreferrer">Reactjs-Popup</a>
                                <a href="https://github.com/jaywcjlove/store.js" target="_blank" rel="noopener noreferrer">store.js</a>
                                <br />
                                <a href="https://github.com/tonaljs/tonal" target="_blank" rel="noopener noreferrer">Tonal</a>
                                <a href="https://github.com/djipco/webmidi" target="_blank" rel="noopener noreferrer">WebMidi.js</a>
                            </div>
                        </div>
                    </Popup>
*/}

{/*
                    <button className="btn btn-large btn-primary" onClick={this.help}
                            title="Open a popup with the some help information.">Help</button>
*/}

{/*
                    <div>TODO: display direction</div>
                    <div>TODO: global filter</div>
*/}

                    <div className="spacer"> </div>

                    <div className="keep-last">
                        Keep the last <input type="text" size="4"
                                             value={this.props.appState.queue_size}
                                             onChange={(e) => this.props.appState.queue_size = parseInt(e.target.value, 10)}/> messages.
                        {/*<input type="range" min="1" max="100"onChange={(e) => this.props.appState.queue_size = parseInt(e.target.value, 10)}/>*/}

                    </div>

                    <button onClick={this.clearMessages}>CLEAR ALL</button>

                </div>
            </Fragment>
        );
    }
}

export default inject('appState')(observer(Header));

