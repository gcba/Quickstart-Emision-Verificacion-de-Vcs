import { IJWK } from "../../utils/base-converter";
import { IKeyPair } from "../keypair";
import { IPackDIDCommMessageArgs } from "./didcomm/didcomm-message";
import { DIDCommMessagePacking, IDIDCommMessage, IPackedDIDCommMessage, IUnpackedDIDCommMessage } from "./didcomm/didcomm-message-media-type";

export interface IDidCommKeyPair extends IKeyPair {
    keyType: 'curve25519' | 'Ed25519' | 'x25519' | 'Secp256k1';
}

export interface IDIDCommSuite {
    load(secrets: IDidCommKeyPair);
    create(): Promise<IDidCommKeyPair>;
    pack(encrypt: boolean,
        toHexKeys: string[],
        documentToSign: string): Promise<string>;
    unpack: (encryptedDocument: string) => Promise<any>;
}

export interface IDIDCommV2Suite {
    load(secrets: IDidCommKeyPair);
    create(): Promise<IDidCommKeyPair>;
    //Deprecated: This method will be removed soon.
    pack(params: {
        senderVerificationMethodId: string,
        toKeys: {
            verificationMethodId: string;
            publicKeyHex: string;
        }[];
        message: IDIDCommMessage;
        packing: DIDCommMessagePacking;
    }): Promise<IPackedDIDCommMessage>;
    unpack: (jwe: any) => Promise<any>;
}