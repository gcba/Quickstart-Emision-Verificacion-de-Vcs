import { WACIMessageHandler, WACIMessageType, Actor } from '../types';

export const handlers = {
  [Actor.Holder]: new Map<WACIMessageType, WACIMessageHandler>(),
  [Actor.Issuer]: new Map<WACIMessageType, WACIMessageHandler>(),
  [Actor.Verifier]: new Map<WACIMessageType, WACIMessageHandler>(),
};
