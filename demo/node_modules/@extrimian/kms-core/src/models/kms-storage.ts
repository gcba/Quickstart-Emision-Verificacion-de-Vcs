import { Secret } from "./secret";
import { Suite } from "./supported-suites";

export interface KMSStorage {
    add(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    getAll(): Promise<Map<string, any>>;
    update(key: string, data: any);
    remove(key: string);
}