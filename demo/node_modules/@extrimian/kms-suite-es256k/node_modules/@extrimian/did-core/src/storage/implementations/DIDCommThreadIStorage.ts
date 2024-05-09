
import {IStorage } from "../interfaces/IStorage";
import { IDIDCommThreadStorage } from "../interfaces/IDIDCommThreadStorage";
import { IDIDCommMessageStorage } from "../interfaces/IDIDCommMessageStorage";
import { DIDCommMessage } from "../../models/messaging/didcom-message";
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

export class DIDCommThreadIStorage<T extends DIDCommMessage<any,any>> implements IDIDCommThreadStorage<T> {
    constructor(private messagesStorage :  IStorage , private threadStorage: IStorage , private thid: string){
    }

 
    public async getThreadMessagesId(){
        return await this.threadStorage.get<string[]>(this.thid)
    }

    public async getThid() : Promise<string> { return this.thid}

    public async getMessageCount(): Promise<number> { 
        let messages = (await this.threadStorage.get<string[]>(this.thid))
        
        return (messages || []).length
    }
    public async add(message: T): Promise<boolean> { 
        if(await this.has(message)){
           
            return false
        }
        await this.messagesStorage.add(message.id , message);
        let ids = await this.getThreadMessagesId() || [];
        ids.push(message.id);
        await this.threadStorage.update(this.thid , ids);
        return true
    }

    public async has(message: T) : Promise<boolean> {
        if(!message)
            return false
        let ids = await this.getThreadMessagesId() || [];
        // console.log(ids)
        return ids.findIndex(x => x === message.id)  >= 0 
    }

    public async getAll(): Promise<T[]> { 
        const ids = await this.getThreadMessagesId() || [];
        const messagePromises = ids.map( x => this.messagesStorage.get<T>(x))
        return (await Promise.all(messagePromises)).filter(x => x) || [];
    }

    public async getByIndex(index: number): Promise<T> {
        if(index < 0 )
            return;
        const ids = await this.getThreadMessagesId();
        if(index >= ids.length )
            return;

        return await this.messagesStorage.get<T>(ids[index]);
        
    }
    public async get(id: string): Promise<T> { 
        return await this.messagesStorage.get<T>(id);
    }

    public async remove(id: string): Promise<boolean> {
        let ids = await this.getThreadMessagesId();
        let filteredIds = ids.filter(x => x !== id );
        if(ids.length == filteredIds.length)
            return false
        await this.threadStorage.update(this.thid, filteredIds)
        await this.messagesStorage.remove(id)
        return true;
    }
    public async removeByIndex(index: number): Promise<boolean> {
        if(index < 0 )
            return
        
        const ids = await this.getThreadMessagesId();
        if(index >= ids.length )
            return;
        
        return this.remove(ids[index]);
    }
    
}