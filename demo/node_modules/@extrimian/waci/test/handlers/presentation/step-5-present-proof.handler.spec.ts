import { callbacks } from '../../../src/callbacks';
import {
  badPresentProofMessageStub,
  presentProofMessageStub,
  requestPresentationMessageStub,
} from '../../stubs';
import {
  AckStatus,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
} from '../../../src';
import { PresentProofHandler } from '../../../src/handlers/presentation/step-5-present-proof.handler';

jest.mock('../../../src/utils', () => ({
  extractSuffixFromUUID:
    jest.requireActual('../../../src/utils').extractSuffixFromUUID,
  verifyPresentation:
    jest.requireActual('../../../src/utils').verifyPresentation,
  extractExpectedChallenge:
    jest.requireActual('../../../src/utils').extractExpectedChallenge,
  createUUID: (): string => 'f137e0db-db7b-4776-9530-83c808a34a42',
}));

describe('PresentProofHandler', () => {
  Object.assign(callbacks, {
    verifier: {
      getPresentationDefinition: async () => [],
      verifyCredential: () => true,
      verifyPresentation: () => true,
    },
  });
  const handler = new PresentProofHandler();
  it('should return status OK', async () => {
    const response = await handler.handle([
      requestPresentationMessageStub,
      presentProofMessageStub,
    ]);
    const expectedResponse: WACIMessageHandlerResponse = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.PresentationAck,
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        from: 'did:example:issuer',
        to: ['did:example:holder'],
        body: {
          status: AckStatus.Ok,
        },
      },
    };

    expect(response).toEqual(expectedResponse);
  });

  it('should return status FAIL when wrong data is presented', async () => {
    Object.assign(callbacks, {
      verifier: {
        getPresentationDefinition: async () => [
          {
            id: 'ed7d9b1f-9eed-4bde-b81c-3aa7485cf947',
            media_type: 'application/json',
            format: 'dif/presentation-exchange/definitions@v1.0',
            data: {
              json: {
                options: {
                  challenge: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                  domain: '4jt78h47fh47',
                },
                presentation_definition: {
                  id: '32f54163-7166-48f1-93d8-ff217bdb0654',
                  frame: {
                    '@context': [
                      'https://www.w3.org/2018/credentials/v1',
                      'https://w3id.org/vaccination/v1',
                      'https://w3id.org/security/suites/bls12381-2020/v1',
                    ],
                    type: ['VerifiableCredential', 'VaccinationCertificate'],
                    credentialSubject: {
                      '@explicit': true,
                      type: ['VaccinationEvent'],
                      batchNumber: {},
                      countryOfVaccination: {},
                    },
                  },
                  input_descriptors: [
                    {
                      id: 'vaccination_input',
                      name: 'Vaccination Certificate',
                      constraints: {
                        fields: [
                          {
                            path: ['$.credentialSubject.batchNumber'],
                            filter: {
                              type: 'string',
                            },
                          },
                          {
                            path: ['$.credentialSubject.countryOfVaccination'],
                            filter: {
                              type: 'string',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        verifyCredential: () => true,
        verifyPresentation: () => true,
      },
    });

    const response2 = await handler.handle([
      requestPresentationMessageStub,
      {
        ...badPresentProofMessageStub,
        attachments: [],
      },
    ]);

    const expectedResponse = {
      message: {
        body: {
          status: 'FAIL',
        },
        from: 'did:example:issuer',
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        to: ['did:example:holder'],
        type: 'https://didcomm.org/present-proof/3.0/ack',
      },
      responseType: 1,
    };

    expect(response2).toEqual(expectedResponse);
  });
});
