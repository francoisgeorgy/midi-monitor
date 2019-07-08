import {hs} from "./hexstring";

export function inputIntValue(s) {
    if (s === undefined || s === null || s === '') return 0;
    return parseInt(s, 10) % 256;
}

export function getParameterByName(name) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}



