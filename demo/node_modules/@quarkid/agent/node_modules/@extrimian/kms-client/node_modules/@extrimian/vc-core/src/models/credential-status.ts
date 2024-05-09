import { CredentialStatusType } from "./credential-status-type";

export class CredentialStatus {
    id: string;
    type: CredentialStatusType;
    revocationListIndex: string;
    revocationListCredential: string;
}