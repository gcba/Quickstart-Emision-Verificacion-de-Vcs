
import {IStorage } from "../interfaces/IStorage";
import { IDIDCommMessageStorage } from "../interfaces/IDIDCommMessageStorage";
import { DIDCommMessage } from "../../models/messaging/didcom-message";
import { DIDCommThreadIStorage } from "./DIDCommThreadIStorage";
//MessageStorage Using IStorage
export class DIDCommMessageIStorage<T extends DIDCommMessage<any,any>> implements IDIDCommMessageStorage<T> {
    
    constructor(private messagesStorage :  IStorage , private threadStorage: IStorage ){}

    public async add(message: T): Promise<boolean>{
        let thid = message.thid;
        let thread = await this.threadStorage.get<string[]>(message.thid);
        if(!thread){
            await this.threadStorage.add(thid , [])
        }
        let messageThreadStorage = new DIDCommThreadIStorage<T>(this.messagesStorage , this.threadStorage , thid);
        
        return await messageThreadStorage.add(message);
    }

    public async get(id: string, thid?: string): Promise<T>{
        if(thid){
            const ids = await this.threadStorage.get<string[]>(thid)
            // console.log("ids")
            if(!ids || ids.findIndex(x=> x === id) < 0)
                return;
        }
        return this.messagesStorage.get<T>(id) 
        
    }


    public async getByThread(thid: string): Promise<DIDCommThreadIStorage<T>>{
        const messageThreadStorage = new DIDCommThreadIStorage<T>(this.messagesStorage , this.threadStorage , thid);

        return messageThreadStorage;
    }
    public async remove(message: T) : Promise<boolean>{
        const messageThreadStorage = new DIDCommThreadIStorage<T>(this.messagesStorage , this.threadStorage , message.thid);
        return await messageThreadStorage.remove(message.id)
    }

    public async removeById(id: string, thid?: string): Promise<boolean> {
        const message = await this.messagesStorage.get<T|undefined>(id);
        if(!message)
            return false
        if(thid && message.thid !== thid)
            return false
        const messageThreadStorage = new DIDCommThreadIStorage<T>(this.messagesStorage , this.threadStorage , thid);
        return await messageThreadStorage.remove(id)
    }

    public async removeThread(thid: string): Promise<boolean> {
        try{
            const messageThreadStorage = new DIDCommThreadIStorage<T>(this.messagesStorage , this.threadStorage , thid);
            const ids = await messageThreadStorage.getThreadMessagesId();
            await this.threadStorage.remove(thid)
            const promises = ids.map(x=> this.messagesStorage.remove(x))
            await Promise.all(promises)
        }catch(e){
            return false;
        }
        return true;
    }
}

