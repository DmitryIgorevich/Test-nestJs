export type TKeys<T> = Array<keyof T>;

export interface IIndexing<T = unknown> {
    [key: string | number | symbol]: T;
}
