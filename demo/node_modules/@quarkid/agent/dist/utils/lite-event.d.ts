export interface ILiteEvent<T> {
    on(handler: {
        (data?: T): void;
    }): void;
    off(handler: {
        (data?: T): void;
    }): void;
    once(handler: {
        (data?: T): void;
    }): any;
}
export declare class LiteEvent<T> implements ILiteEvent<T> {
    private handlers;
    on(handler: {
        (data?: T): void;
    }): void;
    off(handler: {
        (data?: T): void;
    }): void;
    trigger(data?: T): void;
    once(handler: {
        (data?: T): void;
    }): void;
    expose(): ILiteEvent<T>;
}
