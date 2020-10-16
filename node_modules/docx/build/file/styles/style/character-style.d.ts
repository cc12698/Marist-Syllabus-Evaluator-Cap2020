import { IRunStylePropertiesOptions } from "../../../file/paragraph/run/properties";
import { Style } from "./style";
export interface IBaseCharacterStyleOptions {
    readonly basedOn?: string;
    readonly link?: string;
    readonly semiHidden?: boolean;
    readonly run?: IRunStylePropertiesOptions;
}
export interface ICharacterStyleOptions extends IBaseCharacterStyleOptions {
    readonly id: string;
    readonly name?: string;
}
export declare class CharacterStyle extends Style {
    private readonly runProperties;
    constructor(options: ICharacterStyleOptions);
}
