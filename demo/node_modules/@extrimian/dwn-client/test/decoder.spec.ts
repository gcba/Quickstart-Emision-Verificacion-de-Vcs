import { decodeMessage } from '../src/utils';
import { ThreadMethod } from '../src';

describe( 'Decoder', () => {
  it( 'should asd', async () => {
    const message = {
      descriptor: {
        cid: {
          codec: 'dag-pb',
          version: 0,
          hash: {
            type: 'Buffer',
            data: [
              18, 32, 202, 132, 171, 92, 224, 94, 3, 202, 152, 200, 210, 128,
              196, 66, 24, 77, 218, 80, 75, 183, 246, 212, 112, 137, 239, 8,
              253, 107, 246, 209, 249, 103,
            ],
          },
        },
        method: ThreadMethod.Create,
        schema: 'https://schema.org/LikeAction',
        objectId: 'b6464162-84af-4aab-aff5-f1f8438dfr16',
        dataFormat: 'application/JSON-LD',
        dateCreated: 1656047043406,
      },
      data: {
        data: {
          type: 'Buffer',
          data: [
            8, 2, 18, 71, 123, 34, 100, 97, 116, 97, 34, 58, 123, 34, 118, 101,
            114, 105, 102, 105, 97, 98, 108, 101, 95, 99, 114, 101, 100, 101,
            110, 116, 105, 97, 108, 34, 58, 34, 99, 114, 101, 100, 101, 110,
            116, 105, 97, 108, 34, 125, 44, 34, 100, 105, 100, 34, 58, 34, 100,
            105, 100, 58, 103, 101, 114, 109, 97, 110, 58, 116, 101, 115, 116,
            34, 125, 24, 71,
          ],
        },
        links: [],
        size: 79,
      },
    };
    const decoded = decodeMessage( message );
    expect( decoded ).toEqual(
      JSON.stringify( {
        data: { verifiable_credential: 'credential' },
        did: 'did:german:test',
      } )
    );
  } );
} );
