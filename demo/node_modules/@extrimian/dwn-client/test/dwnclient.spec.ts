import nock from 'nock';
import { DWNClient } from '../src';
import { dwnResponse1 } from './data/dwn-responses';
import { storageMock } from './mocks/storage.mock';

nock('http://localhost:1337').post('/').reply(200, dwnResponse1);
describe('DWNClient', () => {
  const client = new DWNClient({
    inboxURL: 'http://localhost:1337/',
    did: 'did:ion:test',
    storage: storageMock,
  });

  it('should asd', async () => {
    const data = [
      {
        data: {
          verifiable_credential: 'credential',
        },
        did: 'did:german:test',
      },
      {
        data: {
          verifiable_credential: 'credential',
        },
        did: 'did:german:test',
        testeando: {
          verifiable_credential: 'credential',
        },
      },
      {
        did: 'did:german:test',
      },
      {
        type: 'https://didcomm.org/issue-credential/3.0/propose-credential',
        id: '7f62f655-9cac-4728-854a-775ba6944593',
        pthid: 'f137e0db-db7b-4776-9530-83c808a34a42',
        from: 'did:example:holder',
        to: [ 'did:example:issuer' ],
      },
      {
        type: 'https://didcomm.org/issue-credential/3.0/issue-credential',
        id: '7a476bd8-cc3f-4d80-b784-caeb2ff265da',
        thid: '7f62f655-9cac-4728-854a-775ba6944593',
        from: 'did:example:issuer',
        to: [ 'did:example:holder' ],
        body: {},
        attachments: [
          {
            id: 'e00e11d4-906d-4c88-ba72-7c66c7113a78',
            media_type: 'application/json',
            format: 'dif/credential-manifest/fulfillment@v1.0',
            data: {
              json: {
                '@context': [
                  'https://www.w3.org/2018/credentials/v1',
                  'https://identity.foundation/credential-manifest/fulfillment/v1',
                ],
                type: [ 'VerifiablePresentation', 'CredentialFulfillment' ],
                credential_fulfillment: {
                  id: 'a30e3b91-fb77-4d22-95fa-871689c322e2',
                  manifest_id: 'dcc75a16-19f5-4273-84ce-4da69ee2b7fe',
                  descriptor_map: [
                    {
                      id: 'driver_license_output',
                      format: 'ldp_vc',
                      path: '$.verifiableCredential[0]',
                    },
                  ],
                },
                verifiableCredential: [
                  {
                    '@context': 'https://www.w3.org/2018/credentials/v1',
                    id: 'https://eu.com/claims/DriversLicense',
                    type: [ 'VerifiableCredential', 'EUDriversLicense' ],
                    issuer: 'did:foo:123',
                    issuanceDate: '2010-01-01T19:23:24Z',
                    credentialSubject: {
                      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
                      license: {
                        number: '34DGE352',
                        dob: '07/13/80',
                      },
                    },
                    proof: {
                      created: '2021-06-07T20:02:44.730614315Z',
                      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..NVum9BeYkhzwslZXm2cDOveQB9njlrCRSrdMZgwV3zZfLRXmZQ1AXdKLLmo4ClTYXFX_TWNyB8aFt9cN6sSvCg',
                      proofPurpose: 'assertionMethod',
                      type: 'Ed25519Signature2018',
                      verificationMethod:
                        'did:orb:EiA3Xmv8A8vUH5lRRZeKakd-cjAxGC2A4aoPDjLysjghow#tMIstfHSzXfBUF7O0m2FiBEfTb93_j_4ron47IXPgEo',
                    },
                  },
                ],
                proof: {
                  created: '2021-06-07T20:02:44.730614315Z',
                  jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..NVum9BeYkhzwslZXm2cDOveQB9njlrCRSrdMZgwV3zZfLRXmZQ1AXdKLLmo4ClTYXFX_TWNyB8aFt9cN6sSvCg',
                  proofPurpose: 'authentication',
                  type: 'Ed25519Signature2018',
                  verificationMethod:
                    'did:orb:EiA3Xmv8A8vUH5lRRZeKakd-cjAxGC2A4aoPDjLysjghow#tMIstfHSzXfBUF7O0m2FiBEfTb93_j_4ron47IXPgEo',
                },
              },
            },
          },
        ],
      },
    ];

    const func = async (messages : any[]) : Promise<void> => {
      messages.forEach((message, index) => {
        const parsedMessage = JSON.parse(message.data);
        console.log(`Decoded message ${index + 1}: `, parsedMessage);
        expect(JSON.parse(messages[index].data)).toEqual(data[index]);
      });
    };

    client.addSubscriber(func);
    client.pullNewMessages();

    await new Promise((resolve) => {
      setTimeout(() => resolve(undefined), 1000);
    });
  });

  it('should asdsdd', async () => {
    const messages = [
      {
        data: '{"body":{"accept":["didcomm/v2"],"goal_code":"streamlined-vc"},"from":"did:ion:gibraltar","id":"f137e0db-db7b-4776-9530-83c808a34a42","type":"https://didcomm.org/out-of-band/2.0/invitation"}',
        descriptor: {
          cid: {
            codec: 'dag-pb',
            hash: {
              data: [
                18, 32, 186, 94, 108, 61, 10, 57, 82, 32, 221, 60, 113, 146,
                252, 159, 116, 120, 186, 188, 49, 129, 243, 74, 146, 143, 56,
                246, 181, 213, 184, 13, 68, 230,
              ],
              type: 'Buffer',
            },
            version: 0,
          },
          dataFormat: 'application/json',
          dateCreated: 1657810733,
          method: 'ThreadsCreate',
          objectId: 'b2464a62-933e-4aa2-a2d6-034abpp7069',
          schema: 'https://schema.org/LikeAction',
        },
      },
      {
        data: {
          from: 'did:modena:matic:EiB-AfQYuwSuKk0kzADMMa1qhn-WZ4aVFF_t4a-qeoQuOA',
          id: 'd549de11-5f10-4e66-8e51-b134174d096c',
          pthid: 'f137e0db-db7b-4776-9530-83c808a34a42',
          to: [ 'did:ion:gibraltar' ],
          type: 'https://didcomm.org/issue-credential/3.0/propose-credential',
        },
        descriptor: {
          dataFormat: 'application/json',
          dateCreated: 1657810736,
          method: 'ThreadsCreate',
          objectId: '16a251b6-13da-4044-b6a3-71c20f4be007',
        },
      },
      {
        data: '{"attachments":[{"data":{"json":{"credential_manifest":{"id":"dcc75a16-19f5-4273-84ce-4da69ee2b7fe","issuer":{"id":"did:ion:gibraltar","name":"Gibraltar"},"output_descriptors":[{"display":{"description":{"text":"Card which acknowledges holder\'s Gibraltarian citizenship."},"subtitle":{"fallback":"Verifiable Credential","path":["$.class","$.vc.class"]},"title":{"fallback":"Gibraltar Citizen Card","path":["$.name","$.vc.name"]}},"id":"permanent_resident_card_output","schema":""}],"version":"0.1.0"},"options":{"challenge":"508adef4-b8e0-4edf-a53d-a260371c1423","domain":"9rf25a28rs96"}}},"format":"dif/credential-manifest/manifest@v1.0","id":"e00e11d4-906d-4c88-ba72-7c66c7113a78","media_type":"application/json"},{"data":{"json":{"@context":["https://www.w3.org/2018/credentials/v1","https://identity.foundation/credential-manifest/fulfillment/v1"],"credential_fulfillment":{"descriptor_map":[{"format":"ldp_vc","id":"permanent_resident_card_output","path":"$.verifiableCredential[0]"}],"id":"a30e3b91-fb77-4d22-95fa-871689c322e2","manifest_id":"dcc75a16-19f5-4273-84ce-4da69ee2b7fe"},"type":["VerifiablePresentation","CredentialFulfillment"],"verifiableCredential":[{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/citizenship/v1"],"credentialSubject":{"birthCountry":"Gibraltar","birthDate":"1958-07-17","commuterClassification":"C1","email":"neiljamesentwistle_putax@hotmail.com","familyName":"Entwistle","gender":"Male","givenName":"Neil James","id":"did:example:b34ca6cd37bbf23","image":"data:image/png;base64,iVBORw0KGgo...kJggg==","lprCategory":"C09","lprNumber":"999-999-999","nationality":{"name":"British"},"residentSince":"2010-01-01","telephone":"+31 6 14201452","type":["PermanentResident","Person"]},"description":"Government of Gibraltar Permanent Resident Card.","expirationDate":"2022-02-02T12:19:52Z","id":"https://gov.gi/credentials/NJE18021972","identifier":"83627465","issuanceDate":"2012-02-02T12:19:52Z","issuer":"did:example:28394728934792387","name":"Permanent Resident Card","type":["VerifiableCredential","PermanentResidentCard"]}]}},"format":"dif/credential-manifest/fulfillment@v1.0","id":"b55f39c1-a7e5-4d4f-8ba0-716a19ec013a","media_type":"application/json"}],"body":{},"from":"did:ion:gibraltar","id":"dc55b177-c6ad-47f3-a076-05c1b7fc43af","thid":"d549de11-5f10-4e66-8e51-b134174d096c","to":["did:modena:matic:EiB-AfQYuwSuKk0kzADMMa1qhn-WZ4aVFF_t4a-qeoQuOA"],"type":"https://didcomm.org/issue-credential/3.0/offer-credential"}',
        descriptor: {
          cid: {
            codec: 'dag-pb',
            hash: {
              data: [
                18, 32, 144, 57, 98, 12, 194, 219, 92, 97, 249, 81, 120, 120,
                204, 47, 209, 191, 20, 63, 50, 1, 130, 168, 176, 228, 115, 243,
                63, 110, 243, 223, 170, 187,
              ],
              type: 'Buffer',
            },
            version: 0,
          },
          dataFormat: 'application/json',
          dateCreated: 1657810741,
          method: 'ThreadsReply',
          objectId: 'b30bc5eb-6cda-4ce2-99ed-871fc46dcc23',
          parent: '16a251b6-13da-4044-b6a3-71c20f4be007',
          root: '16a251b6-13da-4044-b6a3-71c20f4be007',
        },
      },
    ];

    storageMock.saveMessages(messages as any);
    expect(
      await client.getMessages({ root: '16a251b6-13da-4044-b6a3-71c20f4be007' })
    ).toEqual([
      {
        data: {
          from: 'did:modena:matic:EiB-AfQYuwSuKk0kzADMMa1qhn-WZ4aVFF_t4a-qeoQuOA',
          id: 'd549de11-5f10-4e66-8e51-b134174d096c',
          pthid: 'f137e0db-db7b-4776-9530-83c808a34a42',
          to: [ 'did:ion:gibraltar' ],
          type: 'https://didcomm.org/issue-credential/3.0/propose-credential',
        },
        descriptor: {
          dataFormat: 'application/json',
          dateCreated: 1657810736,
          method: 'ThreadsCreate',
          objectId: '16a251b6-13da-4044-b6a3-71c20f4be007',
        },
      },
      {
        data: '{"attachments":[{"data":{"json":{"credential_manifest":{"id":"dcc75a16-19f5-4273-84ce-4da69ee2b7fe","issuer":{"id":"did:ion:gibraltar","name":"Gibraltar"},"output_descriptors":[{"display":{"description":{"text":"Card which acknowledges holder\'s Gibraltarian citizenship."},"subtitle":{"fallback":"Verifiable Credential","path":["$.class","$.vc.class"]},"title":{"fallback":"Gibraltar Citizen Card","path":["$.name","$.vc.name"]}},"id":"permanent_resident_card_output","schema":""}],"version":"0.1.0"},"options":{"challenge":"508adef4-b8e0-4edf-a53d-a260371c1423","domain":"9rf25a28rs96"}}},"format":"dif/credential-manifest/manifest@v1.0","id":"e00e11d4-906d-4c88-ba72-7c66c7113a78","media_type":"application/json"},{"data":{"json":{"@context":["https://www.w3.org/2018/credentials/v1","https://identity.foundation/credential-manifest/fulfillment/v1"],"credential_fulfillment":{"descriptor_map":[{"format":"ldp_vc","id":"permanent_resident_card_output","path":"$.verifiableCredential[0]"}],"id":"a30e3b91-fb77-4d22-95fa-871689c322e2","manifest_id":"dcc75a16-19f5-4273-84ce-4da69ee2b7fe"},"type":["VerifiablePresentation","CredentialFulfillment"],"verifiableCredential":[{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/citizenship/v1"],"credentialSubject":{"birthCountry":"Gibraltar","birthDate":"1958-07-17","commuterClassification":"C1","email":"neiljamesentwistle_putax@hotmail.com","familyName":"Entwistle","gender":"Male","givenName":"Neil James","id":"did:example:b34ca6cd37bbf23","image":"data:image/png;base64,iVBORw0KGgo...kJggg==","lprCategory":"C09","lprNumber":"999-999-999","nationality":{"name":"British"},"residentSince":"2010-01-01","telephone":"+31 6 14201452","type":["PermanentResident","Person"]},"description":"Government of Gibraltar Permanent Resident Card.","expirationDate":"2022-02-02T12:19:52Z","id":"https://gov.gi/credentials/NJE18021972","identifier":"83627465","issuanceDate":"2012-02-02T12:19:52Z","issuer":"did:example:28394728934792387","name":"Permanent Resident Card","type":["VerifiableCredential","PermanentResidentCard"]}]}},"format":"dif/credential-manifest/fulfillment@v1.0","id":"b55f39c1-a7e5-4d4f-8ba0-716a19ec013a","media_type":"application/json"}],"body":{},"from":"did:ion:gibraltar","id":"dc55b177-c6ad-47f3-a076-05c1b7fc43af","thid":"d549de11-5f10-4e66-8e51-b134174d096c","to":["did:modena:matic:EiB-AfQYuwSuKk0kzADMMa1qhn-WZ4aVFF_t4a-qeoQuOA"],"type":"https://didcomm.org/issue-credential/3.0/offer-credential"}',
        descriptor: {
          cid: {
            codec: 'dag-pb',
            hash: {
              data: [
                18, 32, 144, 57, 98, 12, 194, 219, 92, 97, 249, 81, 120, 120,
                204, 47, 209, 191, 20, 63, 50, 1, 130, 168, 176, 228, 115, 243,
                63, 110, 243, 223, 170, 187,
              ],
              type: 'Buffer',
            },
            version: 0,
          },
          dataFormat: 'application/json',
          dateCreated: 1657810741,
          method: 'ThreadsReply',
          objectId: 'b30bc5eb-6cda-4ce2-99ed-871fc46dcc23',
          parent: '16a251b6-13da-4044-b6a3-71c20f4be007',
          root: '16a251b6-13da-4044-b6a3-71c20f4be007',
        },
      },
    ]);

    // expect(await client.getMessages(filters)).toEqual([ message1 ]);
    // expect(await client.getMessages(rootFilter)).toEqual([ message1, message2 ]);
    // expect(await client.getMessages(wrongFilters1)).toEqual([]);
    // expect(await client.getMessages(wrongFilters2 as any)).toEqual([]);
  });
});
