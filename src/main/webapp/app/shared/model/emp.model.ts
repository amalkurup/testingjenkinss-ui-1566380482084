export interface IEmp {
    id?: number;
    name?: string;
    addr?: string;
    contactNumber?: number;
}

export class Emp implements IEmp {
    constructor(public id?: number, public name?: string, public addr?: string, public contactNumber?: number) {}
}
