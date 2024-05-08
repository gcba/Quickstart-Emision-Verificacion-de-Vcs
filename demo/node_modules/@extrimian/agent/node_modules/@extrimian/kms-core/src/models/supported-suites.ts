export enum Suite {
    ES256k = "es256k",
    DIDComm = "didcomm",
    DIDCommV2 = "didcommv2",
    Bbsbls2020 = "bbsbls2020",
    RsaSignature2018 = "rsaSignature2018",
    Ed25519Suite = "ed25519Suite",
}

export enum VCSuite {
    Bbsbls2020 = "bbsbls2020",
    RsaSignature2018 = "rsaSignature2018",
}

export function getTypeBySuite(suite: Suite) {
    switch (suite) {
        case Suite.DIDComm: return "X25519KeyAgreementKey2019";
        case Suite.Bbsbls2020: return "Bls12381G1Key2020";
        case Suite.RsaSignature2018: return "RsaSignature2018";
    }
    return null;
}