import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
  Actor,
  PresentationDefinition,
  CredentialPresentation,
} from '../../types';
import { createUUID } from '../../utils';
import { callbacks } from '../../callbacks';

@RegisterHandler(Actor.Holder, WACIMessageType.RequestPresentation)
export class RequestPresentationHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];
    const holderDID = message.to[0];
    const verifierDID = message.from;
    const presentationDefinition =
      message.attachments?.[0]?.data?.json?.presentation_definition as PresentationDefinition;
    const challenge = message.attachments?.[0]?.data?.json?.options?.challenge;

    if (!challenge) throw new Error('No challenge defined');
    if (!presentationDefinition?.input_descriptors) {
      throw new Error('Presentation definition without input required');
    }
    const { credentialsToPresent } = await callbacks[
      Actor.Holder
    ].getCredentialPresentation({
      frame: presentationDefinition.frame,
      inputDescriptors: presentationDefinition.input_descriptors,
      message
    });

    const credentialPresentation = await this.createMessage(
      presentationDefinition,
      challenge,
      credentialsToPresent,
      holderDID,
      message,
    );
    return {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.PresentProof,
        id: createUUID(),
        thid: message.thid,
        from: holderDID,
        to: [verifierDID],
        body: {},
        attachments: [credentialPresentation],
      },
    };
  }

  private async createMessage(
    presentationDefinition: PresentationDefinition,
    challenge: string,
    credentialsToPresent: any[],
    holderDID: string,
    message: WACIMessage
  ): Promise<CredentialPresentation> {
    const definition_id = presentationDefinition.id;
    const descriptor_map = presentationDefinition.input_descriptors.map(
      (descriptor, index) => ({
        id: descriptor.id,
        format: 'ldp_vp',
        path: `$.verifiableCredential[${index}]`,
      }),
    );

    const messageData = {
      '@context': [
        'https://extrimian.blob.core.windows.net/rskec/securityv1.jsonld',
        'https://extrimian.blob.core.windows.net/rskec/credentialsv1.jsonld',
        'https://extrimian.blob.core.windows.net/rskec/presentation-exchangesubmissionv1.jsonld',
      ],
      type: ['VerifiablePresentation', 'PresentationSubmission'],
      holder: holderDID,
      presentation_submission: {
        id: createUUID(),
        definition_id,
        descriptor_map,
      },
      verifiableCredential: credentialsToPresent,
    };

    const signedData = await callbacks[Actor.Holder].signPresentation({
      contentToSign: messageData,
      challenge,
      message
    });

    return {
      id: createUUID(),
      media_type: 'application/ld+json',
      format: 'dif/presentation-exchange/submission@v1.0',
      data: {
        json: signedData,
      },
    } as CredentialPresentation;
  }
}
