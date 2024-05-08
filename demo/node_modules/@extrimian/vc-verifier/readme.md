# Extrimian - VS Verifier
This package provides the functionality to verify a verifiable credential.

## VCVerifierService

To verify a credential you can initialize a VCVerifierService

```
constructor(private params: {
        didDocumentResolver: (did: string) => Promise<DIDDocument>
}) {

}
```

This service requires a callback to resolve a DID. You need to implement the callback so that given a did returns a DIDDocument

### Verify Method
Then you can call verify method to verify the credential

```
async verify(vc: VerifiableCredential | string, purpose: Purpose): Promise<{ result: boolean, errors?: string[] }> {

}
```
+ **vc**: Verifiable credential (with proofs) to verify
+ **purpose**: purpose to verify (this is checked using the did document)