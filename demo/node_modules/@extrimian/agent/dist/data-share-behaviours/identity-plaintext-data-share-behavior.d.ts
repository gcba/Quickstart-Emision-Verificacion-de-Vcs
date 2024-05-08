import { IdentityDataShareBehavior, IdentityExportParams, IdentityExportResult } from "./identity-data-share-behavior";
export declare class IdentityPlainTextDataShareBehavior implements IdentityDataShareBehavior {
    export(exportParams: IdentityExportParams): Promise<IdentityExportResult>;
    import(exportResult: IdentityExportResult): Promise<IdentityExportParams>;
}
