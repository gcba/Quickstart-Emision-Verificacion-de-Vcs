"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransportByInstance = void 0;
function GetTransportByInstance(transports, instance) {
    return transports.find(x => x instanceof instance);
}
exports.GetTransportByInstance = GetTransportByInstance;
//# sourceMappingURL=transport.js.map