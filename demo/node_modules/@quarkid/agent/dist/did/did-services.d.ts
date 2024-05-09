export declare class DIDServices {
    addService(service: {
        id: string;
        endpointURL: string;
    }): void;
    removeService(serviceId: string): void;
    updateService(updateService: {
        serviceId: string;
        enpodintURL: string;
    }): void;
    addDWNKey(dwn: {
        endpointURL: string;
    }): void;
}
