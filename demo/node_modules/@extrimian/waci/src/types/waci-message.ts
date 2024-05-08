enum SharedMessageType {
  OutOfBandInvitation = 'https://didcomm.org/out-of-band/2.0/invitation',
}

enum IssuanceMessageType {
  ProposeCredential = 'https://didcomm.org/issue-credential/3.0/propose-credential',
  OfferCredential = 'https://didcomm.org/issue-credential/3.0/offer-credential',
  RequestCredential = 'https://didcomm.org/issue-credential/3.0/request-credential',
  IssueCredential = 'https://didcomm.org/issue-credential/3.0/issue-credential',
  IssuanceAck = 'https://didcomm.org/issue-credential/3.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/2.0/problem-report',
}

enum PresentationMessageType {
  ProposePresentation = 'https://didcomm.org/present-proof/3.0/propose-presentation',
  RequestPresentation = 'https://didcomm.org/present-proof/3.0/request-presentation',
  PresentProof = 'https://didcomm.org/present-proof/3.0/presentation',
  PresentationAck = 'https://didcomm.org/present-proof/3.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/2.0/problem-report',
}

export const WACIMessageType = {
  ...SharedMessageType,
  ...IssuanceMessageType,
  ...PresentationMessageType,
};

// eslint-disable-next-line no-redeclare
export type WACIMessageType =
  | SharedMessageType
  | IssuanceMessageType
  | PresentationMessageType;

export enum GoalCode {
  Issuance = 'streamlined-vc',
  Presentation = 'streamlined-vp',
}

export const enum AckStatus {
  Ok = 'OK',
  Fail = 'FAIL',
  Pending = 'PENDING',
}

export type WACIMessage = {
  type: WACIMessageType;
  id: string;
  from: string;
  to?: string[];
  body?: any;
  pthid?: string;
  thid?: string;
  attachments?: any[];
};

export const enum WACIMessageResponseType {
  CreateThread,
  ReplyThread,
}

export type WACIMessageHandlerResponse = {
  message: WACIMessage;
  responseType: WACIMessageResponseType;
};

export type WACIResponse = {
  message: WACIMessage;
  target: string;
  responseType: WACIMessageResponseType;
};

export interface WACIMessageHandler {
  handle(
    messageThread: WACIMessage[],
  ): Promise<WACIMessageHandlerResponse | void>;
}
