import { IdType } from "../models/id-type";
import { VerifiableCredential } from "../models/verifiable-credential";
import * as jsonld from 'jsonld';
import { CredentialStatus } from "../models/credential-status";
import { Issuer } from "../models/issuer";

export class VerifiableCredentialService {
    constructor() {

    }

    async createCredential(params: {
        vcInfo: {
            issuer: Issuer,
            expirationDate: Date,
            id: string,
            issuanceDate?: Date,
            credentialStatus?: CredentialStatus,
            credentialSchema?: IdType,
            refreshService?: IdType,
            types: string[]
        }
        context: string[],
        data: any,
        mappingRules: any
    }): Promise<VerifiableCredential> {

        let vc = new VerifiableCredential({
            "@context": params.context,
            issuer: params.vcInfo.issuer,
            expirationDate: params.vcInfo.expirationDate,
            id: params.vcInfo.id,
            issuanceDate: params.vcInfo.issuanceDate,
            credentialSubject: this.mapDataWithRules(params.data, params.mappingRules),
            credentialStatus: params.vcInfo.credentialStatus,
            credentialSchema: params.vcInfo.credentialSchema,
            refreshService: params.vcInfo.refreshService,
        });

        vc.type = params.vcInfo.types;

        if (vc.type.indexOf("VerifiableCredential") == -1) {
            vc.type.push("VerifiableCredential");
        }

        const compacted = await (<any>jsonld).compact(vc, vc["@context"]);

        return compacted;
    }

    verify(vc: VerifiableCredential) {

    }

    private mapDataWithRules(data: any, mappingRules: any): any {
        if (!mappingRules) {
            return data;
        }

        const schemaObject = {};

        for (let prop in mappingRules) {
            this.mapProperty(schemaObject, prop, data, mappingRules[prop]);
        }

        return schemaObject;
    }

    private mapProperty(schemaObjectProperty: any, schemaPropertyName: string, modelObjectProperty: any, modelPropertyName: string) {
        const modelField = this.getModelValue(modelObjectProperty, modelPropertyName);
        this.setSchemaValue(schemaObjectProperty, schemaPropertyName, modelField);
    }

    getModelValue(obj, path) {
        path = path.split(':');
        var current = obj;
        while (path.length) {
            if (typeof current !== 'object') return undefined;
            current = current[path.shift()];
        }
        return current;
    }

    setSchemaValue(obj, path, value) {
        path = path.split(':') as string[];
        var current = obj;
        while (path.length) {
            if (path.length == 1) {
                current[path.shift()] = value;
            } else {
                const prop = path.shift();
                if (current[prop] === undefined) {
                    current[prop] = {};
                }
                current = current[prop];
            }
        }
        return current;
    }
}