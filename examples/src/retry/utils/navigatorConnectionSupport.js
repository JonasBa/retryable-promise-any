"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNavigatorConnectionSupported = (navigator) => {
    return (navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection ||
        false);
};
exports.DEFAULT_CONNECTION_API = {
    downlink: Infinity,
    downlinkMax: Infinity,
    effectiveType: "4g",
    rtt: 0,
    saveData: false,
    onChange: () => void 0
};
const getNavigatorConnectionAPI = (navigator) => {
    const connectionAPI = isNavigatorConnectionSupported(navigator);
    if (!connectionAPI) {
        return exports.DEFAULT_CONNECTION_API;
    }
    return Object.keys(connectionAPI).reduce((definition, key) => {
        if (definition[key] !== undefined) {
            return definition;
        }
        definition[key] = exports.DEFAULT_CONNECTION_API[key];
        return definition;
    }, connectionAPI);
};
exports.default = getNavigatorConnectionAPI;
