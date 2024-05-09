import { IStorage } from '../../models/agent-storage';
import { DID } from '../../models/did';
import { CredentialFlow } from '../models/credentia-flow';
import { VCProtocol } from './vc-protocol';
export declare class OpenIDProtocol extends VCProtocol<any> {
    private storage;
    constructor(params?: {
        issuer?: {};
        hoder?: {};
        verifier?: {};
        storage: IStorage;
    });
    generateGUID(): string;
    processMessage(message: any, context?: any, _did?: DID): Promise<any>;
    isProtocolMessage(message: any): Promise<boolean>;
    createInvitationMessage(flow: CredentialFlow, did: DID): Promise<any>;
}
export interface MicrosoftCredential {
    jti: string;
    iat: number;
    response_type: string;
    response_mode: string;
    scope: string;
    nonce: string;
    client_id: string;
    redirect_uri: string;
    prompt: string;
    state: string;
    exp: number;
    registration: Registration;
    claims: Claims;
    pin: Pin;
    id_token_hint: string;
}
export interface Claims {
    vp_token: VpToken;
}
export interface VpToken {
    presentation_definition: PresentationDefinition;
}
export interface PresentationDefinition {
    id: string;
    input_descriptors: InputDescriptor[];
}
export interface InputDescriptor {
    id: string;
    schema: Schema[];
    issuance: Issuance[];
}
export interface Issuance {
    manifest: string;
}
export interface Schema {
    uri: string;
}
export interface Pin {
    length: number;
    type: string;
    alg: string;
    iterations: number;
    salt: string;
    hash: string;
}
export interface Registration {
    client_name: string;
    subject_syntax_types_supported: string[];
    vp_formats: VpFormats;
}
export interface VpFormats {
    jwt_vp: JwtV;
    jwt_vc: JwtV;
}
export interface JwtV {
    alg: string[];
}
export interface MicrosoftCredentialInfo {
    sub: string;
    aud: string;
    nonce: string;
    sub_jwk: SubJwk;
    did: string;
    given_name: string;
    family_name: string;
    iss: string;
    iat: number;
    jti: string;
    exp: number;
    pin: Pin;
}
export interface Pin {
    length: number;
    type: string;
    alg: string;
    iterations: number;
    salt: string;
    hash: string;
}
export interface SubJwk {
    crv: string;
    kid: string;
    kty: string;
    x: string;
    y: string;
}
export interface MicrosoftCredentialManifest {
    id: string;
    display: Display;
    input: Input;
    iss: string;
    iat: number;
}
export interface Display {
    locale: string;
    contract: string;
    card: Card;
    consent: Consent;
    claims: Claims;
    id: string;
}
export interface Card {
    title: string;
    issuedBy: string;
    backgroundColor: string;
    textColor: string;
    logo: Logo;
    description: string;
}
export interface Logo {
    uri: string;
    description: string;
}
export interface Claims {
    type: string;
    label: string;
}
export interface VcCredentialSubject {
    type: string;
    label: string;
}
export interface Consent {
    title: string;
    instructions: string;
}
export interface Input {
    credentialIssuer: string;
    issuer: string;
    attestations: Attestations;
    id: string;
}
export interface Attestations {
    accessTokens: AccessToken[];
}
export interface AccessToken {
    id: string;
    encrypted: boolean;
    claims: any[];
    required: boolean;
    configuration: string;
    resourceId: string;
    oboScope: string;
}
