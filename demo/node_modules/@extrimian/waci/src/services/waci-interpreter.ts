import { handlers } from '../handlers';
import { callbacks, InputCallbacks } from '../callbacks';
import {
  WACIMessageType,
  WACIMessage,
  GoalCode,
  Actor,
  CredentialManifest,
  CredentialFulfillment,
  WACIResponse,
} from '../types';
import { createUUID, getObjectValues } from '../utils';
import { SUPPORTED_ALGORITHMS } from '../constants';

export class WACIInterpreter {
  private readonly enabledActors: Actor[];

  constructor() {
    this.enabledActors = [];
  }

  setUpFor<T extends Actor>(
    params: InputCallbacks[T],
    actor: T,
  ): WACIInterpreter {
    this.enabledActors.push(actor);
    callbacks[actor] = params;
    return this;
  }

  isWACIMessage(messageToCheck: any): messageToCheck is WACIMessage {
    try {
      return getObjectValues(WACIMessageType).includes(messageToCheck.type);
    } catch (error) {
      return false;
    }
  }

  async createOOBInvitation(
    senderDID: string,
    goalCode: GoalCode,
    body = {},
  ): Promise<WACIMessage> {
    return {
      type: WACIMessageType.OutOfBandInvitation,
      id: createUUID(),
      from: senderDID,
      body: {
        ...body,
        goal_code: goalCode,
        accept: SUPPORTED_ALGORITHMS,
      },
    };
  }

  async createOfferCredentialMessage(
    issuerDID: string,
    holderDID: string,
    manifest: CredentialManifest,
    fulfillment: CredentialFulfillment,
  ): Promise<WACIMessage> {
    return {
      type: WACIMessageType.OfferCredential,
      id: createUUID(),
      from: issuerDID,
      to: [issuerDID],
      body: {},
      attachments: [manifest, fulfillment],
    };
  }

  async processMessage(
    messageThread: WACIMessage[],
  ): Promise<WACIResponse | void> {
    const message = messageThread[messageThread.length - 1];

    for await (const enabledActor of this.enabledActors) {
      const messageHandler = handlers[enabledActor].get(message.type);
      if (messageHandler) {
        const response = await messageHandler.handle(messageThread);
        if (response) {
          return {
            ...response,
            target: response.message.to[0],
            message: response.message,
          };
        }
        return;
      }
    }

    throw Error(`No handler found for message of type '${message.type}'`);
  }
}
