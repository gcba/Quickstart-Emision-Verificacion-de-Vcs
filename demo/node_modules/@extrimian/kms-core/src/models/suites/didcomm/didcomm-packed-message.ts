export interface DIDCommPackedMessage {
    protected: string;
    iv: string;
    ciphertext: string;
    tag: string;
    recipients: [{
        encrypted_key: string;
        header: {
            alg: string;
            iv: string;
            tag: string;
            epk: {
                kty: string;
                crv: string;
                x: string;
            };
            kid: string;
        }
    }]
}