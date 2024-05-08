import { Entry } from './message';

export type InboxRequest = {
  // Target DID
  id : string,
  target : string;
  messages : Entry[];
};
