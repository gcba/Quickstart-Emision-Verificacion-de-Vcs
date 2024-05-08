import axios, { AxiosResponse } from 'axios';
import { InboxRequest } from '../types/inbox-request';
import { ThreadMethod } from '../types/enums';
import { InboxResponse } from '../types/inbox-response';
import { createUUID, decodeMessage } from '../utils';
import { Entry, MessageDescriptor } from '../types/message';

export class InboxConsumer {
  private readonly inboxURL : string;
  private readonly did : string;

  constructor(url : string, did : string) {
    this.inboxURL = url;
    this.did = did;
  }

  async getMessages(
    filters : Omit<MessageDescriptor, 'cid' | 'method'>
  ) : Promise<Entry[]> {
    try {
      const request : InboxRequest = {
        id: createUUID(),
        target: this.did,
        messages: [
          {
            descriptor: {
              method: ThreadMethod.Query,
              ...filters,
            },
          },
        ],
      };

      const { data } = await axios.post<
        InboxRequest,
        AxiosResponse<InboxResponse>
      >(this.inboxURL, request);

      return this.mapResponse(data);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  private mapResponse(response : InboxResponse) : Entry[] {
    return response.replies.flatMap((reply) =>
      reply.entries.flatMap((thread) =>
        thread.map((message) => ({
          ...message,
          data: decodeMessage(message),
        }))
      )
    );
  }
}
