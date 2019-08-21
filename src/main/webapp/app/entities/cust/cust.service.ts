import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICust } from 'app/shared/model/cust.model';

type EntityResponseType = HttpResponse<ICust>;
type EntityArrayResponseType = HttpResponse<ICust[]>;

@Injectable({ providedIn: 'root' })
export class CustService {
    public resourceUrl =  '/' + 'api/custs';

    constructor(protected http: HttpClient) {}

    create(cust: ICust): Observable<EntityResponseType> {
        return this.http.post<ICust>(this.resourceUrl, cust, { observe: 'response' });
    }

    update(cust: ICust): Observable<EntityResponseType> {
        return this.http.put<ICust>(this.resourceUrl, cust, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICust>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICust[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
