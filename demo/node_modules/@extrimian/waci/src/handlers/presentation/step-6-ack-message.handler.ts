import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageType,
  Actor,
} from '../../types';
import { callbacks } from '../../callbacks';

@RegisterHandler(Actor.Holder, WACIMessageType.PresentationAck)
export class PresentationAckMessageHandler implements WACIMessageHandler {
  async handle(messageThread : WACIMessage[]) : Promise<void> {
    const message = messageThread[messageThread.length - 1];
    await callbacks[Actor.Holder].handlePresentationAck({ status: message.body, message });
  }
}
