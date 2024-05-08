import { Actor } from '../../types';
import { handlers } from '../index';

export const RegisterHandler =
  (actor : Actor, messageType : any) : any =>
    (target : new (...args : never[]) => any) => {
      const actorHandlers = handlers[actor];
      // eslint-disable-next-line new-cap
      actorHandlers.set(messageType, new target());
    };
