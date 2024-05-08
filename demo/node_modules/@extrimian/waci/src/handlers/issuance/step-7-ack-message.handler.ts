import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageType,
  Actor,
} from '../../types';
import { callbacks } from '../../callbacks';

@RegisterHandler(Actor.Issuer, WACIMessageType.IssuanceAck)
export class IssuanceAckMessageHandler implements WACIMessageHandler {
  async handle(messageThread: WACIMessage[]): Promise<void> {
    const message = messageThread[messageThread.length - 1];
    await callbacks[Actor.Issuer].handleIssuanceAck({
      status: message.body.status,
      message: message,
      from: message.from,
      pthid: message.pthid,
      thid: message.thid,
    });
  }
}
