import { AxiosResponse } from 'axios';
import { InboxRequest } from '../types/inbox-request';
import { InboxResponse } from '../types/inbox-response';
import { Entry, MessageDescriptor } from '../types/message';
import { createUUID, parseDateToUnixTimestamp } from '../utils';
import { httpClient } from './http-client';

type DescriptorParam = Omit<MessageDescriptor, 'dateCreated' | 'cid'> & {
  dateCreated : Date;
};

export type SendMessageParams = {
  targetDID : string;
  targetInboxURL : string;
  message : { data : any; descriptor : DescriptorParam };
};

export class InboxSender {
  async sendMessage(params : SendMessageParams) : Promise<Entry[]> {
    const { dateCreated: date, objectId } = params.message.descriptor;

    const request : InboxRequest = {
      id: createUUID(),
      target: params.targetDID,
      messages: [
        {
          ...params.message,
          descriptor: {
            ...params.message.descriptor,
            objectId: objectId || createUUID(),
            dateCreated: parseDateToUnixTimestamp(date),
          },
        },
      ],
    };

    await httpClient.post<InboxRequest, AxiosResponse<InboxResponse>>(
      params.targetInboxURL,
      request
    );

    return request.messages;
  }
}
