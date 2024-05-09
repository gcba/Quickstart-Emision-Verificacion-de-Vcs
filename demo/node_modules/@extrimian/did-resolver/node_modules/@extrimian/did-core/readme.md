# DID Core
This package define general interfaces to work with DID such as DIDDocument, DID Methods, Purposes, Services and Verification Methods.

This packages is used by DID Registry and DID Resolver.

It does not add functionality or services but exposes the interfaces that will be used by the rest of the packages


## DID Document
```
export interface DIDDocument {
  "@context": string | string[] | undefined | null;
  id: string;
  verificationMethod: Array<VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  authentication: Array<string | VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  assertionMethod: Array<string | VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  keyAgreement: Array<string | VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  capabilityDelegation: Array<string | VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  capabilityInvocation: Array<string | VerificationMethodPublicKey58 | VerificationMethodGpg | VerificationMethodJwk>;
  service?: Array<Service>
}
```

## Purpose
```
export abstract class Purpose {
    abstract name: string;
}

export class AuthenticationPurpose extends Purpose {
    name = "authentication";
    challenge?: string;

    public constructor(init?: Partial<AuthenticationPurpose>) {
        super();
        Object.assign(this, init);
    }
}

export class AssertionMethodPurpuse {
    name = "assertionMethod";
}

export class CapabilityInvocationPurpose {
    name = "capabilityInvocation";
}

export class KeyAgreementPurpose {
    name = "keyAgreement";
}
```

## Service
```
  id: string,
  type: string,
  serviceEndpoint: string | string[] | Record<string, string | string[]>
```

## Verification Methods
```
export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
}

export interface VerificationMethodPublicKeyHex extends VerificationMethod {
    type: VerificationMethodTypes.Ed25519VerificationKey2018 | VerificationMethodTypes.Bls12381G1Key2020 | VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019;
    publicKeyHex: string;
}

export interface VerificationMethodPublicKey58 extends VerificationMethod {
    type: VerificationMethodTypes.Ed25519VerificationKey2018 | VerificationMethodTypes.Bls12381G1Key2020 | VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019;
    publicKeyBase58: string;
}

export interface VerificationMethodGpg extends VerificationMethod {
    type: VerificationMethodTypes.GpgVerificationKey2020;
    publicKeyGpg: string;
}

export interface VerificationMethodJwk extends VerificationMethod {
    type: VerificationMethodTypes.JsonWebKey2020 | VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019;

    publicKeyJwk: {
        crv: string;
        x: string;
        y: string;
        kty: string;
        kid?: string;
    };
}
```