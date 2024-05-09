import { LANG } from "../lang";
import { IKeyPair } from "../keypair";
import { IJWK } from "../../utils/base-converter";

export interface IES256kKeyPair extends IKeyPair {
    readonly mnemonic?: string;
    readonly curve?: string;
}

export interface IES256kSuite {
    load(IEthrKeyPair: IES256kKeyPair): Promise<void>;
    create(params: { lang: LANG }): Promise<IES256kKeyPair>;
    sign(content: string): Promise<string>;
    verifySignature(originalContent: string, flatSignature: any, publicKey: IJWK): Promise<boolean>;
}