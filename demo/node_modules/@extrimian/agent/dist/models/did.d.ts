export declare class DID {
    value: string;
    private constructor();
    /**
     * This method converts a string value or full verification method id to a data value DID object.
     *
     * @param did - DID input. This value can also be a full verification method id.
     * @returns Data value object that represent a DID
     */
    static from(did: string): DID;
    validate(did: string): boolean;
    getDidMethod(): string;
    isEqual(other: DID): boolean;
    isLongDIDFor(shortDID: DID): boolean;
    isShortDIDFor(longDID: DID): boolean;
    getDIDSuffix(): string;
    private getLongDIDSuffix;
    isLongDID(): boolean;
}
