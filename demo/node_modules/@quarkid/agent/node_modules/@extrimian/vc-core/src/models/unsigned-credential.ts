import { CredentialStatus } from "./credential-status";
import { IdType } from "./id-type";
import { Proof } from "./proofs/proof";
import { Issuer } from "./issuer";

export class UnsignedCredential<TSubject = any> {
  "@context"?: string[] = ["https://www.w3.org/2018/credentials/v1"];
  id: string;
  type: string[];
  issuer: Issuer;
  name?: string;
  description?: string;
  issuanceDate: Date = new Date();
  expirationDate?: Date;
  credentialStatus?: CredentialStatus;
  credentialSubject: TSubject;
  refreshService?: IdType;
  credentialSchema?: IdType;

  constructor(init: Partial<UnsignedCredential<TSubject>>) {
    Object.assign(this, init);

    if (!this["@context"]) this["@context"] = new Array<string>();

    if (this["@context"].indexOf("https://www.w3.org/2018/credentials/v1") == -1) {
      this["@context"].push("https://www.w3.org/2018/credentials/v1");
    }

    if (this.issuanceDate == undefined) this.issuanceDate = new Date();

    if (this.issuanceDate instanceof Date) {
      this.issuanceDate.toString = () => {
        return this.issuanceDate.toISOString()
      }
    }

    if (this.expirationDate && this.expirationDate instanceof Date) {
      this.expirationDate.toString = () => {
        return this.expirationDate.toISOString()
      }
    }
  }
}