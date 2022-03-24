import {TKeys} from '../types';

export class SchemaHelper {

    public static getData<T>(model: any): T {
        const result: Partial<T> = {};
        (Object.keys(model.schema.obj) as TKeys<T>).forEach(item => {
            result[item] = model[item];
        });

        return result as T;
    }
}
