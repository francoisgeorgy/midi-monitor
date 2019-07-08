import React from "react";
import "./Help.css";
/*
// noinspection ES6CheckImport
import {ReactComponent as LeftPanelIcon} from "../img/right-panel-layout.svg";
// noinspection ES6CheckImport
import {ReactComponent as BottomPanelIcon} from "../img/bottom-panel-layout.svg";
// noinspection ES6CheckImport
import {ReactComponent as RightPanelIcon} from "../img/left-panel-layout.svg";
*/

class Help extends React.Component {

/*
    setPosition = (position) => {
        this.props.setPosition(position)
    };
*/

    close = () => {
        window.close();
    };


    render() {
        return (
            <div className="help-wrapper">
                <div className="panel-title">
                    MIDI Baby Editor Help
                    <button className="btn btn-primary btn-small" onClick={this.close}>Close</button>
{/*
                    <div className="console-positions">
                        <div className={this.props.helpPosition === 'left' ? 'on' : ''}
                             title="Display the help on the left"
                             onClick={() => this.setPosition("left")}><LeftPanelIcon /></div>
                        <div className={this.props.helpPosition === 'top' ? 'on' : ''}
                             title="Display the help at the top"
                             onClick={() => this.setPosition("top")}><BottomPanelIcon /></div>
                        <div className={this.props.helpPosition === 'right' ? 'on' : ''}
                             title="Display the help on the right"
                             onClick={() => this.setPosition("right")}><RightPanelIcon /></div>
                    </div>
*/}
                </div>
                <div className="help">
                    {/*<h2>Help</h2>*/}
                    <h2>Quick how-to</h2>
                    <div>
                        <ol>
                            <li>Connect your MIDI Baby to your computer by USB.</li>
                            <li>Enable the MIDI input and output ports corresponding to your MIDI Baby.</li>
                            <li>Click the "Read device" button.</li>
                            <li>Edit any settings.</li>
                            <li>Click the "Write device" to update your MIDI Baby configuration.</li>
                        </ol>
                    </div>
                    <h3>Tips</h3>
                    <div>
                        <ul>
                            <li>Click on any title bar to toggle the visibility of the corresponding panel. This allow you to view only what you are interested in.</li>
                            <li>Enable and use the MIDI monitor to quickly check your configuration.</li>
                        </ul>
                    </div>
                    <h3>Good to know</h3>
                    <div>
                        <ul>
                            <li>When you "Read device", all the editor configuration will be replaced by the one read from the MIDI Baby.</li>
                            <li>Don't refresh the browser page if you don't want to lose your current configuration.</li>
                            <li>It's not mandatory to "Read device" before you "Write device".
                                If you just want to fully reconfigure your MIDI Baby you can simply prepare your configuration in the editor, connect your MIDI Baby if it's not already done and then click "Write device".</li>
                        </ul>
                    </div>
                    <h2>File import and export</h2>
                    <div>
                        You can edit full presets without even having to connect your MIDI Baby. After you are ok with your configuration, click the "Export to file" to save it as a sysex file (.syx).
                        You can then use this file to quickly setup a MIDI Baby with this editor or with any other application able to send read a sysex file and send it.
                    </div>
                    <div>
                        If you configure your MIDI Baby from a file you don't have to use the "Read device" button first. You just have to connect your MIDI Baby, import the file and finally click the "Write device" button.
                    </div>
                    <div>
                        <strong>Tips:</strong> you can nevertheless use the "Read device" to check that the editor can communicate with the MIDI Baby.
                    </div>
                    <div>
                        <strong>Tips:</strong> instead of using the "Import from file" button, you can simply drag&amp;drop a file on the editor.
                    </div>
                    <h3>In case of problem</h3>
                    <div>
                        The main issue you can encounter is a communication problem between the editor and the MIDI Baby. In that case do the following:
                        <ul className="space-above">
                            <li>Disconnect / reconnect the MIDI Baby USB</li>
                            <li>Check the the MIDI input and output ports are visible in the top of the editor and check that you have enabled both input and output.</li>
                            <li>Check that you have authorized your browser to access MIDI devices (small piano keyboard icon visible in the location bar).</li>
                            <li>If all of the above fail, refresh the browser page.</li>
                        </ul>
                    </div>

                    <h2>Messages types</h2>
                    <div>
                        <div className="msg-types-grid">
                            <div className="msg-type-name">PC</div>
                            <div className="msg-type-description">
                                <strong>send counter</strong>: send current counter value.<br />
                                <strong>send single value</strong>: send &lt;Value&gt;.<br />
                                <strong>count</strong>: count up or down, update assigned counter then send its value.
                            </div>
                            <div className="msg-type-name">CC Toggle</div>
                            <div className="msg-type-description">
                                <strong>send counter</strong>: send current counter value.<br />
                                <strong>send single value</strong>: Send CC &lt;Controller&gt; with value &lt;Value&gt;.<br />
                                <strong>count</strong>: count up or down, update assigned counter then send its value.
                            </div>
                            <div className="msg-type-name">CC Return</div>
                            <div className="msg-type-description">
                                Send CC &lt;Controller&gt; with value &lt;Value 1&gt;, wait &lt;Delay&gt;, then send CC &lt;Controller&gt; with value &lt;Value 2&gt;.
                            </div>
                            <div className="msg-type-name">NOTE</div>
                            <div className="msg-type-description">
                                Send NOTE ON &lt;Note&gt; with velocity &lt;Velocity&gt;.<br />
                                Remark: if velocity= 0 most devices will interpret as NOTE OFF.
                            </div>
                            <div className="msg-type-name">NOTE Return</div>
                            <div className="msg-type-description">
                                Send NOTE ON &lt;Note&gt; with velocity &lt;Velocity&gt;, wait &lt;Delay&gt;, then send NOTE OFF.<br />
                                Remark: NOTE OFF is send as NOTE ON with VELOCITY 0.
                            </div>
                            <div className="msg-type-name">Strymon Bank</div>
                            <div className="msg-type-description">
                                <strong>bank down</strong>: send CC80 + 82, value 0, followed by CC80+82, value 127.<br />
                                <strong>bank up</strong>: send CC81 + 82, value 0, followed by CC81+82, value 127.
                            </div>
                            <div className="msg-type-name">Set Tempo</div>
                            <div className="msg-type-description">
                                Send this action twice to set the MIDI clock interval to the time between message sends. Used for setting the clock via tap tempo.<br />
                                If the clock is stopped, MIDI START message will be sent followed by turning on the clock at the required tempo.
                            </div>
                            <div className="msg-type-name">Start Clock</div>
                            <div className="msg-type-description">
                                If the clock is stopped, MIDI START message will be sent and the clock will be started at the last set tempo.<br />
                                If the clock is currently running, send MIDI CONTINUE message.
                            </div>
                            <div className="msg-type-name">Stop Clock</div>
                            <div className="msg-type-description">
                                If the clock is running, MIDI STOP message will be sent and the clock will be stopped.<br />
                                If the clock is not running, no message will be sent.
                            </div>
                            <div className="msg-type-name">Toggle Clock</div>
                            <div className="msg-type-description">
                                If the clock is stopped, send MIDI START and start clock at the last set tempo.<br />
                                If the clock is running, send MIDI STOP and stop the clock.
                            </div>
                            <div className="msg-type-name">Do Nothing</div>
                            <div className="msg-type-description">
                                No action; do nothing.
                            </div>
                        </div>

                    </div>

                    <h2>MIDI in the browser</h2>
                    <div>
                        If you can't get the MIDI communication working, check the following:
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
                            <li>
                                Menu Settings / Advanced / Content settings / MIDI devices</li></ul>
                    </div>
                    <div>
                        You can also open the Settings page and search for "MIDI".
                    </div>
                </div>
            </div>
        );
    }
}

export default Help;
