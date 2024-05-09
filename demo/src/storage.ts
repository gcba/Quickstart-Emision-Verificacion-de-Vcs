import { readFileSync, writeFileSync, existsSync } from 'fs';
import { AgentSecureStorage, IAgentStorage } from '@quarkid/agent';
import { IStorage } from '@quarkid/agent/dist/models/agent-storage';

export class MemoryStorage implements IStorage {
    mapper: Map<string, any> = new Map();

    async add(key: string, value: any): Promise<void> {
        this.mapper.set(key, value);
    }

    async get<T>(key: string): Promise<T> {
        return this.mapper.get(key);
    }

    async update<T>(key: string, value: T): Promise<void> {
        this.mapper.set(key, value);
    }

    async getAll<T>(): Promise<Map<string, T>> {
        return this.mapper;
    }

    async remove(key: string): Promise<void> {
        this.mapper.delete(key);
    }
}

export class MemorySecureStorage implements AgentSecureStorage {
    mapper: Map<string, any> = new Map();

    async add(key: string, value: any): Promise<void> {
        this.mapper.set(key, value);
    }

    async get<T>(key: string): Promise<T> {
        return this.mapper.get(key);
    }

    async getAll(): Promise<Map<string, any>> {
        return this.mapper;
    }

    async update<T>(key: string, value: T): Promise<void> {
        this.mapper.set(key, value);
    }


    async remove(key: string): Promise<void> {
        this.mapper.delete(key);
    }
}

export class FileSystemAgentSecureStorage implements AgentSecureStorage {
    public readonly filepath: string;


    constructor(params: {
        filepath: string
    }) {
        this.filepath = params.filepath;
    }

    async add(key: string, data: any): Promise<void> {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }

    async get(key: string): Promise<any> {
        return this.getData().get(key);
    }

    async getAll(): Promise<Map<string, any>> {
        return this.getData();
    }

    update(key: string, data: any) {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }

    remove(key: string) {
        const map = this.getData();
        map.delete(key);
        this.saveData(map);
    }

    private getData(): Map<string, any> {
        if (!existsSync(this.filepath)) {
            return new Map();
        }

        const file = readFileSync(this.filepath, {
            encoding: "utf-8",
        });

        if (!file) {
            return new Map();
        }

        return new Map(Object.entries(JSON.parse(file)));
    }

    private saveData(data: Map<string, any>) {
        writeFileSync(this.filepath, JSON.stringify(Object.fromEntries(data)), {
            encoding: "utf-8",
        });
    }
}


export class FileSystemStorage implements IAgentStorage {
    public readonly filepath: string;

    constructor(params: {
        filepath: string
    }) {
        this.filepath = params.filepath;
    }

    async update<T>(key: string, value: T): Promise<void> {
        const map = this.getData();
        map.set(key, value as T);
        this.saveData(map);
    }

    async getAll<T>(): Promise<Map<string, any>> {
        return this.getData();
    }

    async remove(key: string): Promise<void> {
        const map = this.getData();
        map.delete(key);
        this.saveData(map);
    }

    async add(key: string, data: any): Promise<void> {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }

    async get(key: string): Promise<any> {
        return this.getData().get(key);
    }

    private getData(): Map<string, any> {
        if (!existsSync(this.filepath)) {
            return new Map();
        }

        const file = readFileSync(this.filepath, {
            encoding: "utf-8",
        });

        if (!file) {
            return new Map();
        }

        return new Map(Object.entries(JSON.parse(file)));
    }

    private saveData(data: Map<string, any>) {
        writeFileSync(this.filepath, JSON.stringify(Object.fromEntries(data)), {
            encoding: "utf-8",
        });
    }
}