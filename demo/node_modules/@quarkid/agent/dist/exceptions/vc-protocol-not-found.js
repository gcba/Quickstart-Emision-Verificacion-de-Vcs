"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCProtocolNotFoundError = void 0;
class VCProtocolNotFoundError extends Error {
    constructor() {
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, VCProtocolNotFoundError.prototype);
    }
}
exports.VCProtocolNotFoundError = VCProtocolNotFoundError;
//# sourceMappingURL=vc-protocol-not-found.js.map