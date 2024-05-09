import { VerifiableCredential } from "@extrimian/vc-core";
import { DID } from "./did";
export interface IVCStorage {
    getAllByDID(did: DID): any;
    save(did: DID, vc: VerifiableCredential): any;
    getById(credentialId: string): any;
    remove(did: DID, credentialId: string): any;
}
