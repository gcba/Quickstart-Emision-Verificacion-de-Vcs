import { IAgentPlugin, IAgentPluginMessage, IAgentPluginResponse } from "./iplugin";
export declare class PluginDispatcher {
    private plugins;
    constructor(plugins: IAgentPlugin[]);
    dispatch(input: IAgentPluginMessage): Promise<IAgentPluginResponse>;
}
