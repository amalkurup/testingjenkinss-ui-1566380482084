import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEmp } from 'app/shared/model/emp.model';

type EntityResponseType = HttpResponse<IEmp>;
type EntityArrayResponseType = HttpResponse<IEmp[]>;

@Injectable({ providedIn: 'root' })
export class EmpService {
    public resourceUrl = SERVER_API_URL + 'api/emps';

    constructor(protected http: HttpClient) {}

    create(emp: IEmp): Observable<EntityResponseType> {
        return this.http.post<IEmp>(this.resourceUrl, emp, { observe: 'response' });
    }

    update(emp: IEmp): Observable<EntityResponseType> {
        return this.http.put<IEmp>(this.resourceUrl, emp, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEmp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEmp[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
