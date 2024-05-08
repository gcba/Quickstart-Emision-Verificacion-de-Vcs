"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModenaResolver = exports.AgentModenaUniversalResolver = void 0;
const did_resolver_1 = require("@extrimian/did-resolver");
class AgentModenaUniversalResolver {
    constructor(resolverURL) {
        this.universalResolver = new did_resolver_1.DIDUniversalResolver({
            universalResolverURL: resolverURL,
        });
    }
    resolve(did) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.universalResolver.resolveDID(did.value);
        });
    }
    resolveWithMetdata(did) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.universalResolver.resolveDIDWithMetadata(did.value);
        });
    }
}
exports.AgentModenaUniversalResolver = AgentModenaUniversalResolver;
class AgentModenaResolver {
    constructor(resolverURL) {
        this.modenaResolver = new did_resolver_1.DIDModenaResolver({
            modenaURL: resolverURL,
        });
    }
    resolve(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const didDocumentResult = yield this.modenaResolver.resolveDID(did.getDIDSuffix());
            return didDocumentResult;
        });
    }
    resolveWithMetdata(did) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.modenaResolver.resolveDIDWithMetadata(did.value);
        });
    }
}
exports.AgentModenaResolver = AgentModenaResolver;
//# sourceMappingURL=agent-resolver.js.map