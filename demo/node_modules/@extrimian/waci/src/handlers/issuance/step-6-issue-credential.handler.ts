import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  AckStatus,
  Actor,
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
} from '../../types';
import { createUUID } from '../../utils';
import { callbacks } from '../../callbacks';
import { ProblemReportMessage } from '../../types/problem-report';

@RegisterHandler(Actor.Holder, WACIMessageType.IssueCredential)
export class IssueCredentialHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];

    const problemReport = new ProblemReportMessage();
    const fulfillmentAcceptance = await callbacks[
      Actor.Holder
    ].handleCredentialFulfillment({
      message,
      credentialFulfillment: message.attachments
    });
    const holderDID = message.to[0];
    const issuerDID = message.from;

    //TODO define when this is neccesary
    if (!fulfillmentAcceptance) {
      return {
        responseType: WACIMessageResponseType.ReplyThread,
        message: {
          type: WACIMessageType.ProblemReport,
          id: createUUID(),
          thid: message.thid,
          from: holderDID,
          to: [issuerDID],
          body: problemReport.presentProofMessage(
            'Holder did not accept the credential',
          ),
        },
      };
    }

    return {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.IssuanceAck,
        id: createUUID(),
        thid: message.thid,
        from: holderDID,
        to: [issuerDID],
        body: {
          status: AckStatus.Ok,
        },
      },
    };
  }
}
