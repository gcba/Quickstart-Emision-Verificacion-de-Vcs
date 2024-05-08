import { ThreadMethod } from './enums';

export type MessageDescriptor = {
  method : ThreadMethod;
  // UUIDv4
  objectId ?: string;
  // Content-Type header (e.g. application/json)
  dataFormat ?: string;
  // content id
  cid ?: {
    codec : string;
    version : number;
    hash : any;
  };
  // Creation date in UNIX timestamp format
  dateCreated ?: number;
  // Data Schema URL
  schema ?: string;
  // Initial thread message id
  root ?: string;
  // Parent (replying to) message id
  parent ?: string;
};

export type Entry = {
  descriptor : MessageDescriptor;
  data ?: any;
};
