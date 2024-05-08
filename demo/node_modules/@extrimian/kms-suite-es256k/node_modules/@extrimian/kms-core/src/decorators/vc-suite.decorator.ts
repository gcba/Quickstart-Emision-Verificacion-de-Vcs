import { Suite } from "../models/supported-suites";

const suites: Map<Suite, new (...args: never[]) => any> = new Map();

const suiteDecorator = (suiteType: any) => {
    return (target: new (...args: never[]) => any) => {
        suites.set(suiteType, target);
    }
}

export { suiteDecorator, suites };