import { MessageStorage } from '../../src/types/message-storage';
import { Entry } from '../../src/types/message';

const messagesStorage : Entry[] = [];
let lastPullDate : Date;
export const storageMock : MessageStorage = {
  async getMessages() : Promise<Entry[]> {
    return messagesStorage;
  },
  async getLastPullDate() : Promise<Date> {
    return lastPullDate;
  },
  async saveMessages(messages : Entry[]) : Promise<void> {
    messagesStorage.push(...messages);
  },
  async updateLastPullDate(date : Date) : Promise<void> {
    lastPullDate = date;
  },
};
