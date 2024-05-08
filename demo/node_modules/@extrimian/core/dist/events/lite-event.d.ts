export interface ILiteEvent<T> {
    on(handler: {
        (data?: T): void;
    }): void;
    off(handler: {
        (data?: T): void;
    }): void;
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
    expose(): ILiteEvent<T>;
}
