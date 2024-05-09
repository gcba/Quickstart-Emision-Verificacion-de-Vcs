export interface IStorage {
    add(key: string, data: any): Promise<void>;
    get<T = any>(key: string): Promise<T>;
    getAll(): Promise<Map<string, any>>;
    update(key: string, data: any): any;
    remove(key: string): any;
}
export interface IAgentStorage extends IStorage {
}
