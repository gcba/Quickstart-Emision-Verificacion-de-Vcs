import { GoalCode, WACIMessage, WACIMessageType } from '../../../src';
import { callbacks } from '../../../src/callbacks';
import { OOBInvitationHandler } from '../../../src/handlers/common/step-2-oob-invitation.handler';

describe('OobInvitationHandler', () => {
  const message : WACIMessage = {
    type: WACIMessageType.OutOfBandInvitation,
    id: 'f137e0db-db7b-4776-9530-83c808a34a42',
    from: 'did:example:issuer',
    body: {
      goal_code: GoalCode.Issuance,
      accept: [ 'didcomm/v2' ],
    },
  };

  Object.assign(callbacks, {
    holder: {
      getHolderDID: () => 'did:modena:1323232',
    },
  });

  it('should return a propose credential message when handling an issuance invitation', async () => {
    const response = await new OOBInvitationHandler().handle([ message ]);

    expect(response.message.type).toEqual(WACIMessageType.ProposeCredential);
  });

  it('should return a propose presentation message when handling a presentation invitation', async () => {
    const presentationInvitation = {
      ...message,
      body: {
        ...message.body,
        goal_code: GoalCode.Presentation,
      },
    };

    const response = await new OOBInvitationHandler().handle([
      presentationInvitation,
    ]);

    expect(response.message.type).toEqual(WACIMessageType.ProposePresentation);
  });

  it('should return a message whose parent thread id matches the invitation message id', async () => {
    const response = await new OOBInvitationHandler().handle([ message ]);

    expect(response.message.pthid).toEqual(message.id);
  });

  it('should return a message whose receiver matches the sender from the handled message', async () => {
    const response = await new OOBInvitationHandler().handle([ message ]);

    expect(response.message.to[0]).toEqual(message.from);
  });
});
