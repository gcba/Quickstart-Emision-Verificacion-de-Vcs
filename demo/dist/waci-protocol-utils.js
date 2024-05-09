"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WACIProtocolService = void 0;
const agent_1 = require("@quarkid/agent");
const common_1 = require("@nestjs/common");
const storage_1 = require("./storage");
let WACIProtocolService = class WACIProtocolService {
    constructor() {
    }
    setCurrentAgent(agent) {
        this.agent = agent;
    }
    getStorage() {
        return new storage_1.FileSystemStorage({ filepath: "waci-protocol-ws.json" });
    }
    getWaciProtocol() {
        return new agent_1.WACIProtocol({
            storage: new storage_1.FileSystemStorage({ filepath: "waci-protocol-ws.json" }),
            issuer: {
                issuerVerificationRules: async (waciInvitationId, holdedDid) => {
                    console.log("issuerVerificationRules", waciInvitationId);
                    return {
                        verified: false,
                        rejectMsg: "Problem report test",
                    };
                },
                issueCredentials: async (waciInvitationId, holderId) => {
                    return new agent_1.WACICredentialOfferSucceded({
                        credentials: [
                            {
                                credential: {
                                    '@context': [
                                        'https://www.w3.org/2018/credentials/v1',
                                        'https://www.w3.org/2018/credentials/examples/v1',
                                        'https://w3id.org/security/bbs/v1',
                                    ],
                                    id: 'http://example.edu/credentials/58473',
                                    type: ['VerifiableCredential', 'AlumniCredential'],
                                    issuer: this.agent.identity.getOperationalDID().value,
                                    issuanceDate: new Date(),
                                    credentialSubject: {
                                        id: holderId,
                                        givenName: 'Juan',
                                        familyName: 'Perez',
                                    },
                                },
                                outputDescriptor: {
                                    id: 'Mi_ba_credential_output',
                                    schema: 'https://schema.org/EducationalOccupationalCredential',
                                    display: {
                                        title: {
                                            path: ['$.credentialSubject.givenName'],
                                            fallback: 'Credencial de Prueba',
                                        },
                                        subtitle: {
                                            path: ['$.credentialSubject.familyName'],
                                            fallback: 'Alumni',
                                        },
                                        description: {
                                            text: 'Credencial de Prueba',
                                        },
                                        properties: [{
                                                path: ['$.credentialSubject.givenName'],
                                                fallback: 'Sin nombre',
                                                label: 'Nombre'
                                            }]
                                    },
                                    styles: {
                                        background: {
                                            color: '#2D0060',
                                        },
                                        thumbnail: {
                                            uri: 'https://dol.wa.com/logo.png',
                                            alt: 'Quark ID',
                                        },
                                        hero: {
                                            uri: 'https://dol.wa.com/alumnos.png',
                                            alt: 'Quark ID',
                                        },
                                        text: {
                                            color: '#6B6C89',
                                        },
                                    },
                                }
                            }
                        ],
                        inputDescriptors: null,
                        issuer: {
                            name: 'Quark ID',
                            styles: {
                                thumbnail: {
                                    uri: 'https://dol.wa.com/logo.png',
                                    alt: 'Quark ID',
                                },
                                hero: {
                                    uri: 'https://dol.wa.com/alumnos.png',
                                    alt: '',
                                },
                                background: {
                                    color: '#2D0060',
                                },
                                text: {
                                    color: '#6B6C89',
                                },
                            },
                        },
                        options: {
                            challenge: '508adef4-b8e0-4edf-a53d-a260371c1423',
                            domain: '9rf25a28rs96',
                        },
                    });
                },
            },
        });
    }
};
exports.WACIProtocolService = WACIProtocolService;
exports.WACIProtocolService = WACIProtocolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WACIProtocolService);
//# sourceMappingURL=waci-protocol-utils.js.map