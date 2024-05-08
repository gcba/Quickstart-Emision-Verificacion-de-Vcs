import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageType,
  WACIMessageResponseType,
  Actor,
  InputDescriptor,
  CredentialRequest,
  PresentationDefinitionFrame,
} from '../../types';
import { createUUID } from '../../utils';
import { callbacks } from '../../callbacks';

@RegisterHandler(Actor.Verifier, WACIMessageType.ProposePresentation)
export class ProposePresentationHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];
    const holderDID = message.from;
    const verifierDID = message.to[0];
    const invitationId = message.pthid;
    const { inputDescriptors, frame } = await callbacks[
      Actor.Verifier
    ].getPresentationDefinition({ invitationId });

    const requestPresentationMessage = this.createMessage(inputDescriptors, frame);
    
    return {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.RequestPresentation,
        id: createUUID(),
        thid: message.id,
        from: verifierDID,
        to: [holderDID],
        body: {},
        attachments: [requestPresentationMessage],
      },
    };
  }

  private createMessage(
    inputDescriptors: InputDescriptor[],
    frame: PresentationDefinitionFrame
  ): CredentialRequest {
    return {
      id: createUUID(),
      media_type: 'application/json',
      format: 'dif/presentation-exchange/definitions@v1.0',
      data: {
        json: {
          options: {
            challenge: createUUID(),
          },
          presentation_definition: {
            id: createUUID(),
            input_descriptors: inputDescriptors,
            frame: frame
          },
        },
      },
    };
  }
}
