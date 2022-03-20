export class CoockieHelper {

    public static findCoockieBy(cookie: string, value: string): string {
        const coockies = cookie.split(' ');
        return coockies.find(item => {
            return item.includes(value);
        }) || '';
    }

    public static getCoockieValue(coockie: string, value: string): string {
        return coockie.replace(`${value}=`, '');
    }
}
