export enum VCSuiteErrorCode {
    DIDDocumentResolutionError = 11,
    InvalidSignatureError = 12,
    VerificationMethodNotFound = 13,
    VerificationRelationshipError = 14,
    AuthenticationPurposeChallengeRequired = 15,
    UnexpectedChallenge = 16,
    VerifiableCredentialRevoked = 21,
    VerifiableCredentialSuspended = 22,
    CredentialStatusServiceError = 23,
    VerifiableCredentialExpired = 24,
    UnhandledVCSuiteError = 99,
    
}

export class VCSuiteError {
    code: number;
    name: string;
    description: string;

    constructor(description?: string) { this.description = description; }
}

export class DIDDocumentResolutionError extends VCSuiteError {
    code = VCSuiteErrorCode.DIDDocumentResolutionError;
    name = "did-document-resolution-error";

    constructor(private did: string) {
        super(`DID Document can't be resolved: ${did}`);
        this.did = did;
    }
}
export class UnhandledVCSuiteError extends VCSuiteError {
    code = VCSuiteErrorCode.UnhandledVCSuiteError;
    name = "unhandled-vc-suite-error";

    constructor(private messageError: string) {
        super(messageError);
    }
}
export class InvalidSignatureError extends VCSuiteError {
    code = VCSuiteErrorCode.InvalidSignatureError;
    name = "vc-invalid-signature";

    constructor() {
        super("Verifiable Credential signature is invalid or verification method is wrong");
    }
}

export class VerificationMethodNotFound extends VCSuiteError {
    code = VCSuiteErrorCode.VerificationMethodNotFound;
    name = "verification-method-not-found";

    constructor(private verificationMethod: string, private did: string) {
        super(`The verification method ${verificationMethod} not found in DID Document: ${did}`);
    }
}

export class VerificationRelationshipError extends VCSuiteError {
    code = VCSuiteErrorCode.VerificationRelationshipError;
    name = "verification-relationship-invalid";

    constructor(private verificationMethod: string, private expectedVerificationRelationship: string) {
        super(`The verification method ${verificationMethod} is not configured as ${expectedVerificationRelationship}`);
    }
}
export class UnexpectedChallengeError extends VCSuiteError {
    code = VCSuiteErrorCode.UnexpectedChallenge;
    name = "unexpected-challenge";

    constructor(private errorMessage: string) {
        super(errorMessage);
    }
}

export class AuthenticationPurposeChallengeRequired extends VCSuiteError {
    code = VCSuiteErrorCode.AuthenticationPurposeChallengeRequired;
    name = "authentication-purpose-challenge-required";

    constructor() {
        super("Authentication purpose require a challenge to create proofs and verify");
    }
}

export class VerifiableCredentialRevoked extends VCSuiteError {
    code = VCSuiteErrorCode.VerifiableCredentialRevoked;
    name = "verifiable-credential-revoked";

    constructor(private errors: string[]) {
        super()
    }
}

export class VerifiableCredentialSuspended extends VCSuiteError {
    code = VCSuiteErrorCode.VerifiableCredentialSuspended;
    name = "verifiable-credential-suspended";

    constructor(private errors: string[]) {
        super()
    }
}

export class CredentialStatusServiceError extends VCSuiteError {
    code = VCSuiteErrorCode.CredentialStatusServiceError;
    name = "credential-status-service-error";

    constructor(private endpoint: string, private httpStatusResult: number, private dataResult: string) {
        super(`Error retrieving information on credential status service with endpoint: ${endpoint}`);
    }
}

export class VerifiableCredentialExpired extends VCSuiteError {
    code = VCSuiteErrorCode.VerifiableCredentialExpired;
    name = "verifiable-credential-expired";

    constructor() {
        super("Expired Credential")
    }
}

export class VCUnexpectedError extends Error {
    constructor(ex: unknown) {
        super("VC Suite unexpected error: " + JSON.stringify(ex));
    }
}