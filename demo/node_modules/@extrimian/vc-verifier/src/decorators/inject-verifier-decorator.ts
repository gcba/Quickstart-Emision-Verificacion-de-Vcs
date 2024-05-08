import { VCVerifier } from "../algorithm-verifications/vc-verifier"

const verifiers: Map<string, new (...args: never[]) => VCVerifier> = new Map();

const InjectVerifier = (proofType: string) => {
    return (target: new (...args: never[]) => VCVerifier) => {
        verifiers.set(proofType, target);
    }
}

export { InjectVerifier , verifiers };