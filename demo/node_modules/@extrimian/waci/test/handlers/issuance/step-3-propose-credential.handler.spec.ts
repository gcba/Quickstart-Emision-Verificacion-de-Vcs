import {
  WACIMessage,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
} from '../../../src';
import {
  credentialManifestParamsStub,
  offerCredentialMessageStub1,
} from '../../stubs';
import { callbacks } from '../../../src/callbacks';
import { ProposeCredentialHandler } from '../../../src/handlers/issuance/step-3-propose-credential.handler';

jest.mock('../../../src/utils', () => ({
  extractSuffixFromUUID:
    jest.requireActual('../../../src/utils').extractSuffixFromUUID,
  verifyPresentation:
    jest.requireActual('../../../src/utils').verifyPresentation,
  createUUID: (): string => 'f137e0db-db7b-4776-9530-83c808a34a42',
}));

describe('ProposeCredentialHandler', () => {
  const message: WACIMessage = {
    type: WACIMessageType.ProposeCredential,
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    from: 'did:example:holder',
    pthid: 'f137e0db-db7b-4776-9530-83c808a34a42',
    to: ['did:example:issuer'],
  };

  Object.assign(callbacks, {
    issuer: { getCredentialManifest: () => credentialManifestParamsStub },
  });

  const handler = new ProposeCredentialHandler();
  it('should return an offer credential message', async () => {
    const response = await handler.handle([message]);
    const expectedResponse: WACIMessageHandlerResponse = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: offerCredentialMessageStub1,
    };
    expect(response).toEqual(expectedResponse);
  });
});
