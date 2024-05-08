import { DIService } from "../../services/dependency-injection.service";
import { injectable, inject } from "inversify";
import { ICommandHandler } from "../../cqrs/icommand.handler";
import { ICommand } from "../../cqrs/icommand";

enum ServiceScope {
  Singleton,
  Transient,
  InRequest,
}

const Injectable = (key: any, scope: ServiceScope = ServiceScope.Transient) => {
  return (implementation: new (...args: never[]) => any) => {
    injectable()(implementation);
    switch (scope) {
      case ServiceScope.InRequest:
        DIService.container.bind<any>(key).to(implementation).inRequestScope();
        break;
      case ServiceScope.Singleton:
        DIService.container
          .bind<any>(key)
          .to(implementation)
          .inSingletonScope();
        break;
      case ServiceScope.Transient:
        DIService.container
          .bind<any>(key)
          .to(implementation)
          .inTransientScope();
        break;
      default:
        break;
    }
  };
};

const Inject =
  <T = unknown>(serviceIdentifier: any) =>
  (
    target: any,
    targetKey?: string | symbol | undefined,
    indexOrPropertyDescriptor?:
      | number
      | TypedPropertyDescriptor<any>
      | undefined
  ) => {
    inject(serviceIdentifier)(target, targetKey, indexOrPropertyDescriptor);
  };

const InjectableHandler = (
  command: new (...args: never[]) => ICommand<any>
) => {
  return (handler: new (...args: never[]) => ICommandHandler<any, any>) => {
    injectable()(handler);
    DIService.addCommand(command, handler);
  };
};

const InjectableHandlerSymbol = (symbol: symbol) => {
  return (handler: new (...args: never[]) => ICommandHandler<any, any>) => {
    injectable()(handler);
    DIService.addSymbol(symbol, handler);
  };
};

export {
  Injectable,
  Inject,
  InjectableHandler,
  ServiceScope,
  InjectableHandlerSymbol,
};
