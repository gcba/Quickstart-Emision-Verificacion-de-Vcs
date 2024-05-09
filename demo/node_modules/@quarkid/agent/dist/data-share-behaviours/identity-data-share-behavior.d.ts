export interface IdentityDataShareBehavior {
    export(exportParams: IdentityExportParams): Promise<IdentityExportResult>;
    import(exportResult: IdentityExportResult): Promise<IdentityExportParams>;
}
export interface IdentityExportParams {
    keys: {
        publicKeyHex: string;
        secret: any;
    }[];
    dids: string[];
    operationalDID: string;
}
export interface IdentityExportResult {
    data: string;
    type: string;
}
