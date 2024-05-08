"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCMessageType = exports.VCProtocol = exports.ActorRole = void 0;
const lite_event_1 = require("../../utils/lite-event");
var ActorRole;
(function (ActorRole) {
    ActorRole[ActorRole["Issuer"] = 0] = "Issuer";
    ActorRole[ActorRole["Holder"] = 1] = "Holder";
    ActorRole[ActorRole["Verifier"] = 2] = "Verifier";
})(ActorRole = exports.ActorRole || (exports.ActorRole = {}));
class VCProtocol {
    get vcArrived() { return this.onVcArrived.expose(); }
    get credentialIssued() { return this.onCredentialIssued.expose(); }
    get vcVerified() { return this.onVcVerified.expose(); }
    get presentationVerified() { return this.onPresentationVerified.expose(); }
    get ackCompleted() { return this.onAckCompleted.expose(); }
    get problemReport() { return this.onProblemReport.expose(); }
    constructor() {
        // protected readonly onCredentialRequested = new LiteEvent<CredentialRequestedEventArg>;
        // public get credentialRequested() { return this.onCredentialRequested.expose(); }
        this.onVcArrived = new lite_event_1.LiteEvent;
        this.onCredentialIssued = new lite_event_1.LiteEvent;
        this.onVcVerified = new lite_event_1.LiteEvent;
        this.onPresentationVerified = new lite_event_1.LiteEvent;
        this.onAckCompleted = new lite_event_1.LiteEvent;
        this.onProblemReport = new lite_event_1.LiteEvent;
    }
    initialize(params) {
        this.agent = params.agent;
    }
}
exports.VCProtocol = VCProtocol;
var VCMessageType;
(function (VCMessageType) {
    VCMessageType[VCMessageType["RequestCredential"] = 0] = "RequestCredential";
})(VCMessageType = exports.VCMessageType || (exports.VCMessageType = {}));
//# sourceMappingURL=vc-protocol.js.map