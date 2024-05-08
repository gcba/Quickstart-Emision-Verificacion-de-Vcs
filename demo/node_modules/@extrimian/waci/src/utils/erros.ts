export enum WaciErrorCode {
    InputDescriptorError = 30
  }
  
  export class WaciMessageError {
    code: number;
    name: string;
    description: string;
  
    constructor(description?: string) { this.description = description; }
  }
  
  export class InputDescriptorError extends WaciMessageError {
    code = WaciErrorCode.InputDescriptorError;
    name = "input-descriptor-not-found";
  
    constructor(private messageError?: string) {
      super(messageError);
    }
  }
  