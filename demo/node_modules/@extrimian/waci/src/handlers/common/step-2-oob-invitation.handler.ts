import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  GoalCode,
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
  Actor,
} from '../../types';
import { createUUID } from '../../utils';
import { callbacks } from '../../callbacks';

@RegisterHandler(Actor.Holder, WACIMessageType.OutOfBandInvitation)
export class OOBInvitationHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];
    let responseMessageType: WACIMessageType;
    switch (message?.body?.goal_code) {
      case GoalCode.Issuance:
        responseMessageType = WACIMessageType.ProposeCredential;
        break;
      case GoalCode.Presentation:
        responseMessageType = WACIMessageType.ProposePresentation;
        break;
      default:
        throw Error('No goal code defined in invitation');
    }

    const holderDID = await callbacks[Actor.Holder].getHolderDID({ message });

    return {
      responseType: WACIMessageResponseType.CreateThread,
      message: {
        type: responseMessageType,
        id: createUUID(),
        pthid: message.id,
        from: holderDID,
        to: [message.from],
      },
    };
  }
}
