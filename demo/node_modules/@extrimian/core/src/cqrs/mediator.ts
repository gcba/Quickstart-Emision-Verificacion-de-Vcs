import { Injectable } from "../dependency-injection/decorators/diconfig.decorator";
import { DIService } from "../services/dependency-injection.service";
import { ICommand } from "./icommand";
import { ICommandHandler } from "./icommand.handler";
import { INotification } from "./inotification";
import { INotificationHandler } from "./inotification.handler";

export abstract class IMediator {
  abstract send<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand
  ): Promise<TResult>;

  abstract sendSymbol<TCommand extends ICommand<TResult>, TResult>(
    symbol: symbol,
    command: TCommand
  ): Promise<TResult>;

  abstract notify<TNotification extends INotification>(
    command: TNotification
  ): Promise<void>;

  abstract notifySymbol<TNotification extends INotification>(
    symbol: symbol,
    command: TNotification
  ): Promise<void>;
}

@Injectable(IMediator)
export class Mediator {
  async send<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand
  ): Promise<TResult> {
    try {
      const handlers = (await DIService.container.getAllAsync(
        command.constructor.name
      )) as ICommandHandler<TCommand, TResult>[];
      return await handlers[handlers.length - 1].handle(command);
    } catch (error) {
      console.error("Failed to run mediator handler", error);
      throw error;
    }
  }

  async sendSymbol<TCommand extends ICommand<TResult>, TResult>(
    symbol: symbol,
    command: TCommand
  ): Promise<TResult> {
    try {
      const handlers = (await DIService.container.getAllAsync(
        symbol
      )) as ICommandHandler<TCommand, TResult>[];
      return await handlers[handlers.length - 1].handle(command);
    } catch (error) {
      console.error("Failed to run mediator handler", error.message);
      throw error;
    }
  }

  async notify<TNotification extends INotification>(
    notification: TNotification
  ): Promise<void> {
    try {
      const handlers = (await DIService.container.getAllAsync(
        notification.constructor.name
      )) as INotificationHandler<TNotification>[];
      handlers.forEach((x) => x.handle(notification));
    } catch (error) {
      console.error("Failed to run mediator handler", error.message);
      throw error;
    }
  }

  async notifySymbol<TNotification extends INotification>(
    symbol: symbol,
    notification: TNotification
  ): Promise<void> {
    try {
      const handlers = (await DIService.container.getAllAsync(
        symbol
      )) as INotificationHandler<TNotification>[];
      handlers.forEach((x) => x.handle(notification));
    } catch (error) {
      console.error("Failed to run mediator handler", error.message);
      throw error;
    }
  }
}
