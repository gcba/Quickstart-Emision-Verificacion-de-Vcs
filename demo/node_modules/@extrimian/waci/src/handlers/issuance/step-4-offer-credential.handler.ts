import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageType,
  WACIMessageResponseType,
  Actor,
  CredentialApplication,
  CredentialManifest,
  CredentialFulfillment,
} from '../../types';
import { createUUID } from '../../utils';
import { callbacks } from '../../callbacks';
import { isNil } from 'lodash';

@RegisterHandler(Actor.Holder, WACIMessageType.OfferCredential)
export class OfferCredentialHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];
    const holderDID = message.to[0];
    const issuerDID = message.from;

    const credentialApplicationParams = {
      manifest: message.attachments.find(
        (attachment) => !isNil(attachment?.data?.json?.credential_manifest),
      ) as CredentialManifest,
      fulfillment: message.attachments.find(
        (attachment) => !isNil(attachment?.data?.json?.credential_fulfillment),
      ) as CredentialFulfillment,
      message
    };

    if (!credentialApplicationParams.manifest)
      throw new Error('Malformed offer credential message');

    const { credentialsToPresent, presentationProofTypes } = await callbacks[
      Actor.Holder
    ].getCredentialApplication(credentialApplicationParams);

    const credentialApplication = await this.createMessage(
      credentialsToPresent,
      presentationProofTypes,
      credentialApplicationParams.manifest,
      message,
    );

    return {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.RequestCredential,
        id: createUUID(),
        thid: message.thid,
        from: holderDID,
        to: [issuerDID],
        body: {},

        attachments: credentialApplication ? [credentialApplication] : [],
      },
    };
  }

  private async createMessage(
    verifiableCredential: any[],
    proofTypes: string[],
    manifest: CredentialManifest,
    message: WACIMessage
  ): Promise<CredentialApplication> {
    const credential_manifest = manifest?.data?.json?.credential_manifest;
    const manifest_id = credential_manifest?.id;
    const presentation_definition =
      credential_manifest?.presentation_definition;
    const definition_id = presentation_definition?.id;
    const input_descriptors = presentation_definition?.input_descriptors;
    const challenge = manifest?.data?.json?.options?.challenge;

    if (!challenge) throw new Error('No challenge defined');
    if (!input_descriptors?.length) return;

    const descriptor_map = input_descriptors?.map((descriptor, index) => ({
      id: descriptor.id,
      format: 'ldp_vp',
      path: `$.verifiableCredential[${index}]`,
    }));

    if (!proofTypes?.length) throw new Error('Proof types need to be defined');
    if (!manifest_id) throw new Error('Malformed credential manifest');

    const messageData = {
      '@context': [
        'https://extrimian.blob.core.windows.net/rskec/securityv1.jsonld',
        'https://extrimian.blob.core.windows.net/rskec/credentialsv1.jsonld',
        'https://extrimian.blob.core.windows.net/rskec/credential-manifestapplicationv1.jsonld',
      ],
      type: ['VerifiablePresentation', 'CredentialApplication'],
      credential_application: {
        id: createUUID(),
        manifest_id,
        format: {
          ldp_vc: {
            proof_type: proofTypes,
          },
        },
      },
      presentation_submission: {
        id: createUUID(),
        definition_id,
        descriptor_map,
      },
      verifiableCredential,
    };

    const signedData = await callbacks[Actor.Holder].signPresentation({
      contentToSign: messageData,
      challenge,
      message
    });

    return {
      id: createUUID(),
      media_type: 'application/json',
      format: 'dif/credential-manifest/application@v1.0',
      data: {
        json: signedData,
      },
    } as CredentialApplication;
  }
}
