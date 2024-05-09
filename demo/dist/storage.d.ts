import { AgentSecureStorage, IAgentStorage } from '@quarkid/agent';
import { IStorage } from '@quarkid/agent/dist/models/agent-storage';
export declare class MemoryStorage implements IStorage {
    mapper: Map<string, any>;
    add(key: string, value: any): Promise<void>;
    get<T>(key: string): Promise<T>;
    update<T>(key: string, value: T): Promise<void>;
    getAll<T>(): Promise<Map<string, T>>;
    remove(key: string): Promise<void>;
}
export declare class MemorySecureStorage implements AgentSecureStorage {
    mapper: Map<string, any>;
    add(key: string, value: any): Promise<void>;
    get<T>(key: string): Promise<T>;
    getAll(): Promise<Map<string, any>>;
    update<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
}
export declare class FileSystemAgentSecureStorage implements AgentSecureStorage {
    readonly filepath: string;
    constructor(params: {
        filepath: string;
    });
    add(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    getAll(): Promise<Map<string, any>>;
    update(key: string, data: any): void;
    remove(key: string): void;
    private getData;
    private saveData;
}
export declare class FileSystemStorage implements IAgentStorage {
    readonly filepath: string;
    constructor(params: {
        filepath: string;
    });
    update<T>(key: string, value: T): Promise<void>;
    getAll<T>(): Promise<Map<string, any>>;
    remove(key: string): Promise<void>;
    add(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    private getData;
    private saveData;
}
