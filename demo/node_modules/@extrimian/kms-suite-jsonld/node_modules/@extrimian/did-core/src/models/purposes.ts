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

export class AssertionMethodPurpose {
    name = "assertionMethod";
}

export class CapabilityInvocationPurpose {
    name = "capabilityInvocation";
}

export class KeyAgreementPurpose {
    name = "keyAgreement";
}
