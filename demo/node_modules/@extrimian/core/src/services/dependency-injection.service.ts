import { Container } from "inversify";
import { ICommand } from "../cqrs/icommand";
import { ICommandHandler } from "../cqrs/icommand.handler";

export class DIService {
  static container = new Container();

  static addCommand<
    TResult,
    TCommand extends ICommand<TResult>,
    TCommandHandler extends ICommandHandler<TCommand, TResult>
  >(
    command: new (...args: never[]) => TCommand,
    handler: new (...args: never[]) => TCommandHandler
  ) {
    DIService.container.bind<TCommandHandler>(command.name).to(handler);
  }

  static addSymbol<
    TResult,
    TCommand extends ICommand<TResult>,
    TCommandHandler extends ICommandHandler<TCommand, TResult>
  >(symbol: symbol, handler: new (...args: never[]) => TCommandHandler) {
    DIService.container.bind<any>(symbol).to(handler);
  }
}
