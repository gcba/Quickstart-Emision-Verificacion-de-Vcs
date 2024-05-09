# Extrimian - VS Core
This package exposes interfaces to work with verifiable credentials.

## VerifiableCredential
```
export class VerifiableCredential<TSubject = any> {
    "@context"?: string[] = ["https://www.w3.org/2018/credentials/v1"];
    id: string;
    type: string[];
    issuer: string;
    name: string;
    description: string;
    issuanceDate: Date = new Date();
    expirationDate?: Date;
    credentialStatus?: CredentialStatus;
    credentialSubject: TSubject;
    refreshService?: IdType;
    credentialSchema?: IdType;
    proof?: Proof

    constructor(init: Partial<VerifiableCredential<TSubject>>) {
    }
}
```

## IdType
```
export interface IdType {
    id: string;
    type: string;
}
```

## Credential Status
```
export class CredentialStatus {
    id: string;
    type: CredentialStatusType;
    revocationListIndex: string;
    revocationListCredential: string;
}
```

## Proof
```
export interface Proof {
    type: string;
    created: string;
    proofPurpose: Purpose;
    verificationMethod: string;
}
```

This package does not add functionalities or features, it just exposes interfaces to be used by other packages.