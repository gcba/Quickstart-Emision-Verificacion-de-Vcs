"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sidetree patch actions. These are the valid values in the action property of a patch.
 */
var PatchAction;
(function (PatchAction) {
    PatchAction["Replace"] = "replace";
    PatchAction["AddPublicKeys"] = "add-public-keys";
    PatchAction["RemovePublicKeys"] = "remove-public-keys";
    PatchAction["AddServices"] = "add-services";
    PatchAction["RemoveServices"] = "remove-services";
})(PatchAction || (PatchAction = {}));
exports.default = PatchAction;
//# sourceMappingURL=PatchAction.js.map