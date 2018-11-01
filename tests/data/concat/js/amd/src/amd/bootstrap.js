if (typeof window === "undefined") {
    window = {};
}

requirejs([
    window.baseUrl + '../config.js'
], function (config) {
    requirejs.config(config);

    require(['main'], {});
});