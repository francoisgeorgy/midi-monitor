import React from "react";
import "./Help.css";

class Help extends React.Component {

    close = () => {
        window.close();
    };

    render() {
        return (
            <div className="help-wrapper">
                <div className="panel-title">
                    MIDI Monitor Help
                    <button className="btn btn-primary btn-small" onClick={this.close}>Close</button>
                </div>
                <div className="help">

                    <h2>MIDI in the browser</h2>
                    <div>
                        If you can not get the MIDI communication working, check the following:
                        <ol className="space-above">
                            <li>
                                <div>You use a browser that supports the Web MIDI API specifications.</div>
                                <div>
                                    Currently, only the following browsers support the Web MIDI API:
                                </div>
                                <div>
                                    <ul className="space-above">
                                        <li>Chrome (Mac, Linux, Windows)</li>
                                        <li>Opera (Mac, Linux, Windows)</li>
                                    </ul>
                                    Web MIDI is not supported under iOS (iPad, iPhone).
                                </div>
                            </li>
                            <li>
                                Access to MIDI devices is not blocked by the browser.
                            </li>
                        </ol>
                    </div>
                    <div>
                        In Chrome, you can access the MIDI permissions via the browser Settings page. Follow this path:
                    </div>
                    <div>
                        <ul>
                            <li>Menu Settings / Advanced / Content settings / MIDI devices</li>
                        </ul>
                    </div>
                    <div>
                        You can also open the Settings page and search for &#34;MIDI&#34;.
                    </div>
                </div>
            </div>
        );
    }
}

export default Help;
