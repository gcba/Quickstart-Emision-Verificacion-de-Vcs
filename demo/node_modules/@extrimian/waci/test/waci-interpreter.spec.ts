import {
  WACIInterpreter,
  WACIResponse,
  WACIMessage,
  WACIMessageResponseType,
  WACIMessageType,
  Actor,
} from '../src';
import { getObjectValues } from '../src/utils';
import {
  credentialManifestParamsStub,
  offerCredentialMessageStub1,
} from './stubs';
import { OfferCredentialMessageParams } from '../src/handlers/issuance/step-3-propose-credential.handler';

jest.mock('../src/utils', () => ({
  extractSuffixFromUUID:
    jest.requireActual('../src/utils').extractSuffixFromUUID,
  getObjectValues: jest.requireActual('../src/utils').getObjectValues,
  createUUID: (): string => 'f137e0db-db7b-4776-9530-83c808a34a42',
}));

describe('WACIInterpreter', () => {
  let waciInterpreter: WACIInterpreter;
  beforeEach(() => {
    waciInterpreter = new WACIInterpreter();
  });
  describe('isWACIMessage method', () => {
    it('should return true when checking a valid message type', () => {
      getObjectValues(WACIMessageType).forEach((type) =>
        expect(waciInterpreter.isWACIMessage({ type })).toBe(true),
      );
    });

    it('should return false when checking an unknown message type', () => {
      expect(waciInterpreter.isWACIMessage({ type: '' })).toBe(false);
      expect(waciInterpreter.isWACIMessage({ type: 'asdasd' })).toBe(false);
      expect(waciInterpreter.isWACIMessage({ type: null })).toBe(false);
      expect(waciInterpreter.isWACIMessage({ type: undefined })).toBe(false);
      expect(waciInterpreter.isWACIMessage({ type: {} as any })).toBe(false);
      expect(waciInterpreter.isWACIMessage(null)).toBe(false);
      expect(waciInterpreter.isWACIMessage(undefined)).toBe(false);
    });
  });

  describe('setUpFor method', () => {
    it('should add enabled actor on set up', () => {
      const { enabledActors } = waciInterpreter as any;
      waciInterpreter.setUpFor<Actor.Holder>(null, Actor.Holder);
      expect(enabledActors).toMatchObject([Actor.Holder]);
      waciInterpreter.setUpFor<Actor.Issuer>(null, Actor.Issuer);
      expect(enabledActors).toMatchObject([Actor.Holder, Actor.Issuer]);
      waciInterpreter.setUpFor<Actor.Verifier>(null, Actor.Verifier);
      expect(enabledActors).toMatchObject([
        Actor.Holder,
        Actor.Issuer,
        Actor.Verifier,
      ]);
    });

    it('should be able to chain subsequent calls', () => {
      const { enabledActors } = waciInterpreter as any;
      waciInterpreter
        .setUpFor<Actor.Holder>(null, Actor.Holder)
        .setUpFor<Actor.Issuer>(null, Actor.Issuer)
        .setUpFor<Actor.Verifier>(null, Actor.Verifier);
      expect(enabledActors).toMatchObject([
        Actor.Holder,
        Actor.Issuer,
        Actor.Verifier,
      ]);
    });
  });

  describe('processMessage method', () => {
    const message: WACIMessage = {
      type: WACIMessageType.ProposeCredential,
      id: 'f137e0db-db7b-4776-9530-83c808a34a42',
      from: 'did:example:holder',
      pthid: 'f137e0db-db7b-4776-9530-83c808a34a42',
      to: ['did:example:issuer'],
    };

    it('should throw an error when processing a message with no handlers associated', async () => {
      await expect(() =>
        waciInterpreter.processMessage([message]),
      ).rejects.toThrow();
    });

    it('should return an offer credential message when processing a propose credential message', async () => {
      waciInterpreter.setUpFor<Actor.Issuer>(
        {
          signCredential: null,
          verifyCredential: null,
          handleIssuanceAck: null,
          verifyPresentation: null,
          getCredentialManifest:
            async (): Promise<OfferCredentialMessageParams> =>
              credentialManifestParamsStub,
        },
        Actor.Issuer,
      );
      const expectedResponse: WACIResponse = {
        responseType: WACIMessageResponseType.ReplyThread,
        message: offerCredentialMessageStub1 as any,
        target: 'did:example:holder',
      };

      const response = await waciInterpreter.processMessage([message]);
      expect(response).toEqual(expectedResponse);
    });
  });
});
