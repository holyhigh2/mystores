import { BaseStore, IStore } from "./types";
export declare class Indexed extends BaseStore implements IStore {
    #private;
    constructor();
    keys(): Promise<string[]>;
    clear(): void;
    set(key: string, value: any, expires?: number): Promise<boolean>;
    get(key: string): Promise<any>;
    getString(key: string): null;
    remove(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
}
