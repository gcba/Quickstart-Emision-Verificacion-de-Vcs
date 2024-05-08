import { WACIMessage, WACIMessageType } from '../../src';
import { OfferCredentialMessageParams } from '../../src/handlers/issuance/step-3-propose-credential.handler';

export const credentialManifestParamsStub: OfferCredentialMessageParams = {
  issuerDid: 'did:test:123',
  issuerName: 'testing',
  output: [
    {
      format: 'ldp_vc',
      outputDescriptor: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        schema: '',
        display: {
          title: {
            path: ['$.name', '$.vc.name'],
            fallback: 'vc_test_1',
          },
          subtitle: {
            path: ['$.class', '$.vc.class'],
            fallback: 'Verifiable Credential',
          },
          description: {
            text: 'vc_test_1',
          },
        },
        styles: {
          background: {
            color: 'black',
          },
          thumbnail: {
            uri: 'uri',
            alt: 'alt',
          },
          hero: {
            uri: 'uri',
            alt: 'alt',
          },
          text: {
            color: 'black',
          },
        },
      },

      verifiableCredential: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/citizenship/v1',
          'https://w3id.org/security/bbs/v1',
        ],
        id: 'urn:uvci:af5vshde843jf831j128fj',
        type: [
          'VerifiableCredential',
          'VaccinationCertificate',
          'PermanentResidentCard',
        ],
        name: 'Permanent Resident Card',
        description: 'Permanent Resident Card of Mr.Louis Pasteu',
        expirationDate: '2029-12-03T12:19:52Z',
        issuanceDate: '2019-12-03T12:19:52Z',
        issuer: 'did:example:456',
        credentialSubject: {
          id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
          givenName: 'Louis',
          familyName: 'Pasteur',
          birthCountry: 'Bahamas',
          birthDate: '1958-07-17',
        },
      },
    },
  ],
};

export const offerCredentialMessageAttachmentsStub1 = [
  {
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    media_type: 'application/json',
    format: 'dif/credential-manifest/manifest@v1.0',
    data: {
      json: {
        options: {
          challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        },
        credential_manifest: {
          id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          version: '0.1.0',
          issuer: {
            id: 'did:test:123',
            name: 'testing',
          },
          output_descriptors: [
            {
              id: 'f137e0db-db7b-4776-9530-83c808a34a42',
              schema: '',
              display: {
                title: {
                  path: ['$.name', '$.vc.name'],
                  fallback: 'vc_test_1',
                },
                subtitle: {
                  path: ['$.class', '$.vc.class'],
                  fallback: 'Verifiable Credential',
                },
                description: {
                  text: 'vc_test_1',
                },
              },
              styles: {
                background: {
                  color: 'black',
                },
                thumbnail: {
                  uri: 'uri',
                  alt: 'alt',
                },
                hero: {
                  uri: 'uri',
                  alt: 'alt',
                },
                text: {
                  color: 'black',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    media_type: 'application/json',
    format: 'dif/credential-manifest/fulfillment@v1.0',
    data: {
      json: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://identity.foundation/credential-manifest/fulfillment/v1',
        ],
        type: ['VerifiablePresentation', 'CredentialFulfillment'],
        credential_fulfillment: {
          id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          manifest_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          descriptor_map: [
            {
              id: 'f137e0db-db7b-4776-9530-83c808a34a42',
              format: 'ldp_vc',
              path: '$.verifiableCredential[0]',
            },
          ],
        },
        verifiableCredential: [
          {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://w3id.org/citizenship/v1',
              'https://w3id.org/security/bbs/v1',
            ],
            id: 'urn:uvci:af5vshde843jf831j128fj',
            type: [
              'VerifiableCredential',
              'VaccinationCertificate',
              'PermanentResidentCard',
            ],
            name: 'Permanent Resident Card',
            description: 'Permanent Resident Card of Mr.Louis Pasteu',
            expirationDate: '2029-12-03T12:19:52Z',
            issuanceDate: '2019-12-03T12:19:52Z',
            issuer: 'did:example:456',
            credentialSubject: {
              id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
              givenName: 'Louis',
              familyName: 'Pasteur',
              birthCountry: 'Bahamas',
              birthDate: '1958-07-17',
            },
          },
        ],
      },
    },
  },
];

export const offerCredentialMessageAttachmentsStub2 = [
  {
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    media_type: 'application/json',
    format: 'dif/credential-manifest/manifest@v1.0',
    data: {
      json: {
        options: {
          challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        },
        credential_manifest: {
          id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          version: '0.1.0',
          issuer: {
            id: 'did:test:123',
            name: 'testing',
          },
          presentation_definition: {
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
            frame: {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://w3id.org/citizenship/v1',
                'https://w3id.org/security/suites/bls12381-2020/v1',
              ],
              type: ['VerifiableCredential', 'PermanentResidentCard'],
              credentialSubject: {
                '@explicit': true,
                type: ['PermanentResident'],
                givenName: {},
                familyName: {},
                birthCountry: {},
                birthDate: {},
              },
            },
            input_descriptors: [
              {
                id: 'f137e0db-db7b-4776-9530-83c808a34a42',
                name: 'Permanent Resident Card',
                purpose: 'We need PRC to verify your status.',
                constraints: {
                  fields: [
                    {
                      path: ['$.credentialSubject.givenName'],
                      filter: {
                        type: 'string',
                      },
                    },
                    {
                      path: ['$.credentialSubject.familyName'],
                      filter: {
                        type: 'string',
                      },
                    },
                    {
                      path: ['$.credentialSubject.birthCountry'],
                      filter: {
                        type: 'string',
                      },
                    },
                    {
                      path: ['$.credentialSubject.birthDate'],
                      filter: {
                        type: 'string',
                      },
                    },
                  ],
                },
              },
            ],
          },
          output_descriptors: [
            {
              id: 'f137e0db-db7b-4776-9530-83c808a34a42',
              schema: '',
              display: {
                title: {
                  path: ['$.name', '$.vc.name'],
                  fallback: 'vc_test_1',
                },
                subtitle: {
                  path: ['$.class', '$.vc.class'],
                  fallback: 'Verifiable Credential',
                },
                description: {
                  text: 'vc_test_1',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    media_type: 'application/json',
    format: 'dif/credential-manifest/fulfillment@v1.0',
    data: {
      json: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://identity.foundation/credential-manifest/fulfillment/v1',
        ],
        type: ['VerifiablePresentation', 'CredentialFulfillment'],
        credential_fulfillment: {
          id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          manifest_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
          descriptor_map: [
            {
              id: 'f137e0db-db7b-4776-9530-83c808a34a42',
              format: 'ldp_vc',
              path: '$.verifiableCredential[0]',
            },
          ],
        },
        verifiableCredential: [
          {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://w3id.org/citizenship/v1',
              'https://w3id.org/security/bbs/v1',
            ],
            id: 'urn:uvci:af5vshde843jf831j128fj',
            type: [
              'VerifiableCredential',
              'VaccinationCertificate',
              'PermanentResidentCard',
            ],
            name: 'Permanent Resident Card',
            description: 'Permanent Resident Card of Mr.Louis Pasteu',
            expirationDate: '2029-12-03T12:19:52Z',
            issuanceDate: '2019-12-03T12:19:52Z',
            issuer: 'did:example:456',
            credentialSubject: {
              id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
              givenName: 'Louis',
              familyName: 'Pasteur',
              birthCountry: 'Bahamas',
              birthDate: '1958-07-17',
            },
          },
        ],
      },
    },
  },
];

export const credentialsToPresentStub = [
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/citizenship/v1',
      'https://w3id.org/security/bbs/v1',
    ],
    id: 'urn:uvci:af5vshde843jf831j128fj',
    type: [
      'VerifiableCredential',
      'VaccinationCertificate',
      'PermanentResidentCard',
    ],
    name: 'Permanent Resident Card',
    description: 'Permanent Resident Card of Mr.Louis Pasteu',
    expirationDate: '2029-12-03T12:19:52Z',
    issuanceDate: '2019-12-03T12:19:52Z',
    issuer: 'did:example:456',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      givenName: 'Louis',
      familyName: 'Pasteur',
      birthCountry: 'Bahamas',
      birthDate: '1958-07-17',
    },
    proof: {
      type: 'BbsBlsSignatureProof2020',
      created: '2021-02-18T23:04:28Z',
      nonce:
        'JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=',
      proofPurpose: 'assertionMethod',
      proofValue:
        'AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/',
      verificationMethod: 'did:example:123#key-1',
    },
  },
];

export const credentialApplicationStub = {
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  media_type: 'application/json',
  format: 'dif/credential-manifest/application@v1.0',
  data: {
    json: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/credential-manifest/application/v1',
      ],
      type: ['VerifiablePresentation', 'CredentialApplication'],
      credential_application: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        manifest_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        format: {
          ldp_vc: {
            proof_type: ['JsonWebSignature2020', 'EcdsaSecp256k1Signature2019'],
          },
        },
      },
      presentation_submission: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        definition_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        descriptor_map: [
          {
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
            format: 'ldp_vp',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/citizenship/v1',
            'https://w3id.org/security/bbs/v1',
          ],
          id: 'urn:uvci:af5vshde843jf831j128fj',
          type: [
            'VerifiableCredential',
            'VaccinationCertificate',
            'PermanentResidentCard',
          ],
          name: 'Permanent Resident Card',
          description: 'Permanent Resident Card of Mr.Louis Pasteu',
          expirationDate: '2029-12-03T12:19:52Z',
          issuanceDate: '2019-12-03T12:19:52Z',
          issuer: 'did:example:456',
          credentialSubject: {
            id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
            givenName: 'Louis',
            familyName: 'Pasteur',
            birthCountry: 'Bahamas',
            birthDate: '1958-07-17',
          },
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2021-02-18T23:04:28Z',
            nonce:
              'JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/',
            verificationMethod: 'did:example:123#key-1',
          },
        },
      ],
      proof: {
        type: 'Ed25519Signature2018',
        verificationMethod: 'did:example:123#key-0',
        created: '2021-05-14T20:16:29.565377',
        proofPurpose: 'authentication',
        challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ',
      },
    },
  },
};

export const credentialSignatureStub = {
  created: '2021-06-07T20:02:44.730614315Z',
  jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..NVum9BeYkhzwslZXm2cDOveQB9njlrCRSrdMZgwV3zZfLRXmZQ1AXdKLLmo4ClTYXFX_TWNyB8aFt9cN6sSvCg',
  proofPurpose: 'assertionMethod',
  type: 'Ed25519Signature2018',
  verificationMethod:
    'did:orb:EiA3Xmv8A8vUH5lRRZeKakd-cjAxGC2A4aoPDjLysjghow#tMIstfHSzXfBUF7O0m2FiBEfTb93_j_4ron47IXPgEo',
};

export const signedCredentialStub = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/citizenship/v1',
    'https://w3id.org/security/bbs/v1',
  ],
  id: 'urn:uvci:af5vshde843jf831j128fj',
  type: [
    'VerifiableCredential',
    'VaccinationCertificate',
    'PermanentResidentCard',
  ],
  name: 'Permanent Resident Card',
  description: 'Permanent Resident Card of Mr.Louis Pasteu',
  expirationDate: '2029-12-03T12:19:52Z',
  issuanceDate: '2019-12-03T12:19:52Z',
  issuer: 'did:example:456',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    givenName: 'Louis',
    familyName: 'Pasteur',
    birthCountry: 'Bahamas',
    birthDate: '1958-07-17',
  },
  proof: credentialSignatureStub,
};

export const credentialFulfillmentStub = {
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  media_type: 'application/json',
  format: 'dif/credential-manifest/fulfillment@v1.0',
  data: {
    json: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/credential-manifest/fulfillment/v1',
      ],
      type: ['VerifiablePresentation', 'CredentialFulfillment'],
      credential_fulfillment: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        manifest_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        descriptor_map: [
          {
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: [signedCredentialStub],
      // proof: {
      //   created: '2021-06-07T20:02:44.730614315Z',
      //   jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..NVum9BeYkhzwslZXm2cDOveQB9njlrCRSrdMZgwV3zZfLRXmZQ1AXdKLLmo4ClTYXFX_TWNyB8aFt9cN6sSvCg',
      //   proofPurpose: 'authentication',
      //   type: 'Ed25519Signature2018',
      //   verificationMethod:
      //     'did:orb:EiA3Xmv8A8vUH5lRRZeKakd-cjAxGC2A4aoPDjLysjghow#tMIstfHSzXfBUF7O0m2FiBEfTb93_j_4ron47IXPgEo',
      // },
    },
  },
};

export const badCredentialApplicationStub = {
  id: 'e00e11d4-906d-4c88-ba72-7c66c7113a78',
  media_type: 'application/json',
  format: 'dif/credential-manifest/application@v1.0',
  data: {
    json: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/credential-manifest/application/v1',
      ],
      type: ['VerifiablePresentation', 'CredentialApplication'],
      credential_application: {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        manifest_id: 'dcc75a16-19f5-4273-84ce-4da69ee2b7fe',
        format: {
          ldp_vc: {
            proof_type: ['JsonWebSignature2020', 'EcdsaSecp256k1Signature2019'],
          },
        },
      },
      presentation_submission: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        definition_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        descriptor_map: [
          {
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
            format: 'ldp_vp',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      verifiableCredential: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/citizenship/v1',
            'https://w3id.org/security/bbs/v1',
          ],
          id: 'urn:uvci:af5vshde843jf831j128fj',
          type: [
            'VerifiableCredential',
            'VaccinationCertificate',
            'PermanentResidentCard',
          ],
          name: 'Permanent Resident Card',
          description: 'Permanent Resident Card of Mr.Louis Pasteu',
          expirationDate: '2029-12-03T12:19:52Z',
          issuanceDate: '2019-12-03T12:19:52Z',
          issuer: 'did:example:456',
          credentialSubject: {
            id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
            givenName: 123,
            birthDate: '1958-07-17',
          },
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2021-02-18T23:04:28Z',
            nonce:
              'JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/',
            verificationMethod: 'did:example:123#key-1',
          },
        },
      ],
      proof: {
        type: 'Ed25519Signature2018',
        verificationMethod: 'did:example:123#key-0',
        created: '2021-05-14T20:16:29.565377',
        proofPurpose: 'authentication',
        challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ',
      },
    },
  },
};

export const requestPresentationStub = {
  id: 'ed7d9b1f-9eed-4bde-b81c-3aa7485cf947',
  media_type: 'application/json',
  format: 'dif/presentation-exchange/definitions@v1.0',
  data: {
    json: {
      options: {
        challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
      },
      presentation_definition: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
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
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
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
};

export const presentProofStub = {
  id: '2a3f1c4c-623c-44e6-b159-179048c51260',
  media_type: 'application/ld+json',
  format: 'dif/presentation-exchange/submission@v1.0',
  data: {
    json: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/presentation-exchange/submission/v1',
      ],
      type: ['VerifiablePresentation', 'PresentationSubmission'],
      holder: 'did:example:123',
      verifiableCredential: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/vaccination/v1',
            'https://w3id.org/security/bbs/v1',
          ],
          id: 'urn:uvci:af5vshde843jf831j128fj',
          type: ['VerifiableCredential', 'VaccinationCertificate'],
          description: 'COVID-19 Vaccination Certificate',
          name: 'COVID-19 Vaccination Certificate',
          expirationDate: '2029-12-03T12:19:52Z',
          issuanceDate: '2019-12-03T12:19:52Z',
          issuer: 'did:example:456',
          credentialSubject: {
            id: 'urn:bnid:_:c14n2',
            type: 'VaccinationEvent',
            batchNumber: '1183738569',
            countryOfVaccination: 'NZ',
          },
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2021-02-18T23:04:28Z',
            nonce:
              'JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/',
            verificationMethod: 'did:example:123#key-1',
          },
        },
      ],
      presentation_submission: {
        id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        definition_id: 'f137e0db-db7b-4776-9530-83c808a34a42',
        descriptor_map: [
          {
            id: 'f137e0db-db7b-4776-9530-83c808a34a42',
            format: 'ldp_vp',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      proof: {
        type: 'Ed25519Signature2018',
        verificationMethod: 'did:example:123#key-0',
        created: '2021-05-14T20:16:29.565377',
        proofPurpose: 'authentication',
        challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ',
      },
    },
  },
};

export const badPresentProofStub = {
  id: '2a3f1c4c-623c-44e6-b159-179048c51260',
  media_type: 'application/ld+json',
  format: 'dif/presentation-exchange/submission@v1.0',
  data: {
    json: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://identity.foundation/presentation-exchange/submission/v1',
      ],
      type: ['VerifiablePresentation', 'PresentationSubmission'],
      holder: 'did:example:123',
      verifiableCredential: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/vaccination/v1',
            'https://w3id.org/security/bbs/v1',
          ],
          id: 'urn:uvci:af5vshde843jf831j128fj',
          type: ['VerifiableCredential', 'VaccinationCertificate'],
          description: 'COVID-19 Vaccination Certificate',
          name: 'COVID-19 Vaccination Certificate',
          expirationDate: '2029-12-03T12:19:52Z',
          issuanceDate: '2019-12-03T12:19:52Z',
          issuer: 'did:example:456',
          credentialSubject: {
            id: 'urn:bnid:_:c14n2',
            type: 'VaccinationEvent',
            countryOfVaccination: 'NZ',
          },
          proof: {
            type: 'BbsBlsSignatureProof2020',
            created: '2021-02-18T23:04:28Z',
            nonce:
              'JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=',
            proofPurpose: 'assertionMethod',
            proofValue:
              'AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/',
            verificationMethod: 'did:example:123#key-1',
          },
        },
      ],
      presentation_submission: {
        id: '1d257c50-454f-4c96-a273-c5368e01fe63',
        definition_id: '32f54163-7166-48f1-93d8-ff217bdb0654',
        descriptor_map: [
          {
            id: 'vaccination_input',
            format: 'ldp_vp',
            path: '$.verifiableCredential[0]',
          },
        ],
      },
      proof: {
        type: 'Ed25519Signature2018',
        verificationMethod: 'did:example:123#key-0',
        created: '2021-05-14T20:16:29.565377',
        proofPurpose: 'authentication',
        challenge: 'f137e0db-db7b-4776-9530-83c808a34a42',
        jws: 'eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ',
      },
    },
  },
};

export const offerCredentialMessageStub1: WACIMessage = {
  type: WACIMessageType.OfferCredential,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:issuer',
  to: ['did:example:holder'],
  body: {},
  attachments: offerCredentialMessageAttachmentsStub1,
};

export const offerCredentialMessageStub2: WACIMessage = {
  type: WACIMessageType.OfferCredential,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:issuer',
  to: ['did:example:holder'],
  body: {},
  attachments: offerCredentialMessageAttachmentsStub2,
};

export const requestCredentialMessageStub: WACIMessage = {
  type: WACIMessageType.RequestCredential,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:holder',
  to: ['did:example:issuer'],
  body: {},
  attachments: [credentialApplicationStub],
};

export const requestPresentationMessageStub: WACIMessage = {
  type: WACIMessageType.RequestPresentation,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:issuer',
  to: ['did:example:holder'],
  body: {},
  attachments: [requestPresentationStub],
};

export const presentProofMessageStub: WACIMessage = {
  type: WACIMessageType.PresentProof,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:holder',
  to: ['did:example:issuer'],
  body: {},
  attachments: [presentProofStub],
};

export const badPresentProofMessageStub: WACIMessage = {
  type: WACIMessageType.PresentProof,
  id: 'f137e0db-db7b-4776-9530-83c808a34a42',
  thid: 'f137e0db-db7b-4776-9530-83c808a34a42',
  from: 'did:example:holder',
  to: ['did:example:issuer'],
  body: {},
  attachments: [badPresentProofStub],
};
