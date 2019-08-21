export interface ICust {
    id?: number;
    name?: string;
    addr?: string;
    contactNumber?: number;
}

export class Cust implements ICust {
    constructor(public id?: number, public name?: string, public addr?: string, public contactNumber?: number) {}
}
