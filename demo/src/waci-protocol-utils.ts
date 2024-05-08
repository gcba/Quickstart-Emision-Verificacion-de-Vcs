import { Agent, WACICredentialOfferSucceded, WACIProtocol } from "@extrimian/agent";
import { Injectable } from "@nestjs/common";
import { FileSystemStorage, MemoryStorage } from "./storage";

@Injectable()
export class WACIProtocolService {
    agent: Agent;

    constructor() {

    }

    setCurrentAgent(agent: Agent) {
        this.agent = agent;
    }

    getStorage() {
        return new FileSystemStorage({ filepath: "waci-protocol-ws.json" });
    }

    getWaciProtocol() {
        return new WACIProtocol({
            storage: new FileSystemStorage({ filepath: "waci-protocol-ws.json" }),
            issuer: {
                issuerVerificationRules: async (waciInvitationId: string, holdedDid: string) => {
                    console.log("issuerVerificationRules", waciInvitationId);
                    return {
                        verified: false,
                        rejectMsg: "Problem report test",
                    }
                },
                issueCredentials: async (waciInvitationId: string, holderId: string) => {
                    return new WACICredentialOfferSucceded({
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
                            }],
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
}