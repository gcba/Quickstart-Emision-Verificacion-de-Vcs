import {
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
} from '../../../src';
import {
  credentialsToPresentStub,
  offerCredentialMessageStub2,
  requestCredentialMessageStub,
} from '../../stubs';
import { callbacks } from '../../../src/callbacks';
import { OfferCredentialHandler } from '../../../src/handlers/issuance/step-4-offer-credential.handler';

jest.mock('../../../src/utils', () => ({
  extractSuffixFromUUID:
    jest.requireActual('../../../src/utils').extractSuffixFromUUID,
  verifyPresentation:
    jest.requireActual('../../../src/utils').verifyPresentation,
  createUUID: (): string => 'f137e0db-db7b-4776-9530-83c808a34a42',
}));

describe('OfferCredentialHandler', () => {
  Object.assign(callbacks, {
    holder: {
      getCredentialApplication: () => ({
        credentialsToPresent: credentialsToPresentStub,
        presentationProofTypes: [
          'JsonWebSignature2020',
          'EcdsaSecp256k1Signature2019',
        ],
      }),
      signPresentation: ({ contentToSign }) => ({
        ...contentToSign,
        proof: {
          type: 'Ed25519Signature2018',
          verificationMethod: 'did:example:123#key-0',
          created: '2021-05-14T20:16:29.565377',
          proofPurpose: 'authentication',
          challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
          jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ',
        },
      }),
    },
  });

  const handler = new OfferCredentialHandler();
  it('should return a request credential message', async () => {
    const response = await handler.handle([offerCredentialMessageStub2]);
    const expectedResponse: WACIMessageHandlerResponse = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: requestCredentialMessageStub,
    };
    expect(response).toEqual(expectedResponse);
  });
});
