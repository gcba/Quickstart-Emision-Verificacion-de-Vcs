# Extrimian - KMS Core
This package exposes interfaces to be implemented by KMS concrete implementations like Extrimian KMS Client.

## Interfaces and Enums
```
export interface KMSStorage {
    add(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    getAll(): Promise<Map<string, any>>;
    update(key: string, data: any);
    remove(key: string);
}
```

```
export interface IKeyPair {
    readonly privateKey: string;
    readonly publicKey: string;
}
```

```
export interface IKMS {
    create(suite: Suite): Promise<{ publicKeyJWK: IJWK }>;
    sign(suite: Suite, publicKeyJWK: IJWK, content: any): Promise<string>;
    signVC(suite: Suite,
        publicKeyJWK: IJWK,
        vc: any,
        did: string,
        verificationMethodId: string,
        purpose: Purpose): Promise<VerifiableCredential>;
    pack(publicKeyJWK: IJWK, toHexPublicKeys: string[], contentToSign: string): Promise<string>;
    unpack(publicKeyJWK: IJWK, packedContent: string): Promise<string>;
    export(publicKeyJWK: IJWK): Promise<any>;
    getPublicKeysBySuiteType(suite: Suite): Promise<IJWK[]>;
    getAllPublicKeys(): Promise<IJWK[]>;
}
```

```
export enum LANG {
    en = 'en',
    es = 'es',
    fr = 'fr',
    it = 'it',
}
```

```
export enum Suite {
    ES256k = "es256k",
    DIDComm = "didcomm",
    Bbsbls2020 = "bbsbls2020"
}
```

This package does not add functionality or features, it just exposes interfaces to be used by other packages.