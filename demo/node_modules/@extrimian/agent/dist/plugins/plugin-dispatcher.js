"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginDispatcher = void 0;
const agent_plugin_not_found_1 = require("../exceptions/agent-plugin-not-found");
class PluginDispatcher {
    constructor(plugins) {
        this.plugins = plugins;
    }
    dispatch(input) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const plugin of this.plugins) {
                if (plugin.canHandle(input)) {
                    return yield plugin.handle(input);
                }
            }
            // Si llegamos aquí, es porque ningún plugin puede manejar la entrada
            throw new agent_plugin_not_found_1.AgentPluginNotFound('No plugin was found that can handle the input');
        });
    }
}
exports.PluginDispatcher = PluginDispatcher;
//# sourceMappingURL=plugin-dispatcher.js.map