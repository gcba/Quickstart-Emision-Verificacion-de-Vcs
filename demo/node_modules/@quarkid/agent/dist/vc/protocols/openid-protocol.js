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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIDProtocol = void 0;
const axios_1 = require("axios");
const jwt_decode_1 = require("jwt-decode");
const utils_1 = require("../../utils");
const vc_protocol_1 = require("./vc-protocol");
class OpenIDProtocol extends vc_protocol_1.VCProtocol {
    constructor(params) {
        super();
        this.storage = params.storage;
    }
    generateGUID() {
        function generateSegment() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (generateSegment() +
            generateSegment() +
            '-' +
            generateSegment() +
            '-4' +
            generateSegment().substr(0, 3) +
            '-' +
            generateSegment() +
            '-' +
            generateSegment() +
            generateSegment() +
            generateSegment());
    }
    processMessage(message, context, _did) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request_uri = (0, utils_1.getSearchParam)('request_uri', message);
            const encodedData = (yield axios_1.default.get(request_uri)).data;
            const decodedData = (0, jwt_decode_1.default)(encodedData);
            const credentialData = (0, jwt_decode_1.default)(decodedData.id_token_hint);
            const manifestEncoded = (_a = (yield axios_1.default.get(decodedData.claims.vp_token.presentation_definition.input_descriptors[0]
                .issuance[0].manifest)).data) === null || _a === void 0 ? void 0 : _a.token;
            const credentialManifest = (0, jwt_decode_1.default)(manifestEncoded);
            const { did, sub, aud, exp, iat, iss, jti, nonce, sub_jwk, pin } = credentialData, rest = __rest(credentialData, ["did", "sub", "aud", "exp", "iat", "iss", "jti", "nonce", "sub_jwk", "pin"]);
            const data = {
                credentialSubject: Object.assign({}, rest),
                id: this.generateGUID(),
                type: [
                    decodedData.claims.vp_token.presentation_definition.input_descriptors[0]
                        .id,
                ],
                issuer: {
                    id: credentialData.iss,
                    name: credentialManifest.display.card.issuedBy,
                },
                issuanceDate: new Date(),
            };
            const claims = [
                {
                    path: '$.credentialSubject.given_name',
                    label: 'First Name',
                },
                {
                    path: '$.credentialSubject.family_name',
                    label: 'Last Name',
                },
            ];
            const display = {
                description: {
                    text: credentialManifest.display.card.description,
                },
                title: {
                    text: credentialManifest.display.card.title,
                },
                properties: claims.map((claim) => {
                    const value = {
                        label: claim.label,
                        path: [claim.path],
                        schema: {
                            type: 'string',
                        },
                        fallback: 'Unknown',
                    };
                    return value;
                }),
            };
            const styles = {
                thumbnail: {
                    alt: credentialManifest.display.card.logo.description,
                    uri: credentialManifest.display.card.logo.uri,
                },
                background: { color: credentialManifest.display.card.backgroundColor },
                text: {
                    color: credentialManifest.display.card.textColor,
                },
                hero: {
                    uri: '',
                    alt: '',
                },
            };
            const issuer = {
                id: credentialData.iss,
                name: credentialManifest.display.card.issuedBy,
            };
            this.onVcArrived.trigger({
                credentials: [{ data, styles, display }],
                messageId: "",
                issuer,
            });
        });
    }
    isProtocolMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof message === 'string' &&
                message.includes('openid-vc://') &&
                (0, utils_1.getSearchParam)('request_uri', message)) {
                return true;
            }
            return false;
        });
    }
    createInvitationMessage(flow, did) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
exports.OpenIDProtocol = OpenIDProtocol;
//# sourceMappingURL=openid-protocol.js.map