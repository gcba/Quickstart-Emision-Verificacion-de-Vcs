import { Proof } from "./proofs/proof";
import { UnsignedCredential } from "./unsigned-credential";

export class VerifiableCredential<TSubject = any> extends UnsignedCredential {
  proof?: Proof

  constructor(init: Partial<VerifiableCredential<TSubject>>) {
    super(init);
    this.proof = init.proof;
  }
}