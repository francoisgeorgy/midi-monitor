
export const padZero = (str, len, char) => {
    let s = '';
    let c = char || '0';
    let n = (len || 2) - str.length;
    while (s.length < n) s += c;
    return s + str;
};

// hex
export const h = v => {
    // noinspection JSCheckFunctionSignatures
    return (v === null || v === undefined) ? "" : padZero(v.toString(16).toUpperCase(), 2);
};

export const d = v => {
    // noinspection JSCheckFunctionSignatures
    return (v === null || v === undefined) ? "" : padZero(v.toString(10).toUpperCase(), 2);
};

// hex string
export const hs = data => (data === null || data === undefined) ? "" : (Array.from(data).map(n => h(n))).join(" ");    // Array.from() is necessary to get a non-typed array

// dec string
export const ds = data => (data === null || data === undefined) ? "" : (Array.from(data).map(n => d(n))).join(" ");    // Array.from() is necessary to get a non-typed array

// hex string compact
export const hsc = data => (data === null || data === undefined) ? "" : (Array.from(data).map(n => h(n))).join('');    // Array.from() is necessary to get a non-typed array

export var fromHexString = function(string, sep) {
    let s = sep ? string.replace(sep, '') : string;
    if ((s.length % 2) > 0) {
        // TODO: throw an exception
        console.warn(`fromHexString: invalid hex string: ${s}`);
        return null;
    }
    let a = new Uint8Array(s.length / 2);
    for (let i=0; i < (s.length / 2); i++) {
        a[i] = parseInt(s.substr(i * 2, 2), 16);
    }
    return a;
};
