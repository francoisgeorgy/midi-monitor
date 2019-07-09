# TODO

- devices
    - enable / disable
    - show messages / hide messages
        - hide: messages are still recorded, but not displayed
- display messages in chronological order (last message at bottom) or reverse order (last message at top)
- max number of messages
- filters
- colors
- number of messages received
    - total
    - per port
- hex / dec
- download sysex as file

# MIDI

- message type
    - channel message
        - channel voice (0x80 - 0xEF)
            - 0x8n 1000nnnn, 2 data bytes : Note Off
            - 0x9n 1001nnnn, 2 data bytes : Note On (a velocity of zero = Note Off)
            - 0xAn 1010nnnn, 2 data bytes : Polyphonic Key Pressure (Aftertouch)
            - 0xBn 1011nnnn, 2 data bytes : Controller, first data byte = 0-119
            - 0xCn 1100nnnn, 1 data byte  : Program Change
            - 0xDn 1101nnnn, 1 data byte  : Channel Pressure (Aftertouch)
            - 0xEn 1110nnnn, 2 data bytes : Pitch Bend
        - channel mode (subset of 0xBn)
            - 120 All Sound Off
            - 121 Reset All Controllers            
            - 122 Local Control On/Off
            - 123 All Notes Off
            - 124 Omni Mode Off
            - 125 Omni Mode On
            - 126 Mono Mode On (Poly Off)
            - 127 Poly Mode On (Mono Off)
    - system message
        - system exclusive  (0xF0)
            - 0xF0 Start of System Exclusive (SOX)
            - 0xF7 End of System Exclusive (EOX)
        - system common (0xF1 - 0xF7)
            - 0xF1 MIDI Time Code Quarter Frame
            - 0xF2 Song Position Pointer
            - 0xF3 Song Select
            - 0xF4 Undefined
            - 0xF5 Undefined
            - 0xF6 Tune Request
            - 0xF7 End of System Exclusive (EOX)
        - system realtime (0xF8 - 0xFF)
            - 0xF8 Timing Clock
            - 0xF9 Undefined
            - 0xFA Start
            - 0xFB Continue
            - 0xFC Stop
            - 0xFD Undefined
            - 0xFE Active Sensing
            - 0xFF System Reset
        