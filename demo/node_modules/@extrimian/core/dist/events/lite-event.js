"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteEvent = void 0;
var LiteEvent = /** @class */ (function () {
    function LiteEvent() {
        this.handlers = [];
    }
    LiteEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    LiteEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    LiteEvent.prototype.trigger = function (data) {
        this.handlers.slice(0).forEach(function (h) { return h(data); });
    };
    LiteEvent.prototype.expose = function () {
        return this;
    };
    return LiteEvent;
}());
exports.LiteEvent = LiteEvent;
//# sourceMappingURL=lite-event.js.map