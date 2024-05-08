import {
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
} from '../../../src';
import {
  badCredentialApplicationStub,
  credentialFulfillmentStub,
  offerCredentialMessageStub1,
  requestCredentialMessageStub,
  credentialSignatureStub,
  offerCredentialMessageStub2,
} from '../../stubs';
import { callbacks } from '../../../src/callbacks';
import { RequestCredentialHandler } from '../../../src/handlers/issuance/step-5-request-credential.handler';

jest.mock('../../../src/utils', () => ({
  extractSuffixFromUUID:
    jest.requireActual('../../../src/utils').extractSuffixFromUUID,
  verifyPresentation:
    jest.requireActual('../../../src/utils').verifyPresentation,
  extractExpectedChallenge:
    jest.requireActual('../../../src/utils').extractExpectedChallenge,
  createUUID: (): string => 'f137e0db-db7b-4776-9530-83c808a34a42',
}));

describe('RequestCredentialHandler', () => {
  Object.assign(callbacks, {
    issuer: {
      signCredential: (vc) => ({ ...vc, proof: credentialSignatureStub }),
      verifyCredential: async () => true,
      verifyPresentation: async () => true,
    },
  });

  const handler = new RequestCredentialHandler();

  it('should return a issue credential message when credential application is successful', async () => {
    const response = await handler.handle([
      offerCredentialMessageStub1,
      requestCredentialMessageStub,
    ]);
    const expectedResponse: WACIMessageHandlerResponse = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.IssueCredential,
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        from: 'did:example:issuer',
        to: ['did:example:holder'],
        body: {},
        attachments: [credentialFulfillmentStub],
      },
    };
    expect(response).toEqual(expectedResponse);
  });

  it('should return a issue credential message when credential application is successful', async () => {
    const response = await handler.handle([
      offerCredentialMessageStub1,
      {
        type: WACIMessageType.RequestCredential,
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        from: 'did:example:holder',
        to: ['did:example:issuer'],
        body: {},
        attachments: [],
      },
    ]);
    const expectedResponse: WACIMessageHandlerResponse = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.IssueCredential,
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        from: 'did:example:issuer',
        to: ['did:example:holder'],
        body: {},
        attachments: [credentialFulfillmentStub],
      },
    };
    expect(response).toEqual(expectedResponse);
  });

  it('should return undefined/void when credential application fails', async () => {
    Object.assign(callbacks, {
      issuer: {
        signCredential: (vc) => ({ ...vc, proof: credentialSignatureStub }),
        verifyCredential: async () => false,
        verifyPresentation: async () => false,
      },
    });
    const response = await handler.handle([
      offerCredentialMessageStub2,
      {
        ...requestCredentialMessageStub,
        attachments: [badCredentialApplicationStub],
      },
    ]);
    expect(response).toBe(undefined);
  });
});
