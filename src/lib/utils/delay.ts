import { GenericFunctionType } from "../types/genericFunction";

type DelayReturn = Promise<GenericFunctionType>;

export default function delay(msDelay: number = 1000): DelayReturn {
    return new Promise(resolve => setTimeout(resolve, msDelay));
}