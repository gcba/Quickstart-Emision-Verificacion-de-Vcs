import { ClaimFormat } from './credential-manifest';

export type CredentialApplication = {
  id: string;
  media_type: 'application/json';
  format: 'dif/credential-manifest/application@v1.0';
  data: {
    json: {
      '@context': string[];
      type: string[];
      credential_application: {
        id: string;
        manifest_id: string;
        format?: ClaimFormat;
      };
      presentation_submission: PresentationSubmission;
      verifiableCredential: any[];
      proof: {
        type: string;
        verificationMethod: string;
        created: string;
        proofPurpose: string;
        challenge: string;
        jws: string;
      };
    };
  };
};

export type PresentationSubmission = {
  id: string;
  definition_id: string;
  descriptor_map: {
    id: string;
    format: string;
    path: string;
  }[];
};
