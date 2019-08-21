import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Cust } from 'app/shared/model/cust.model';
import { CustService } from './cust.service';
import { CustComponent } from './cust.component';
import { CustDetailComponent } from './cust-detail.component';
import { CustUpdateComponent } from './cust-update.component';
import { CustDeletePopupComponent } from './cust-delete-dialog.component';
import { ICust } from 'app/shared/model/cust.model';

@Injectable({ providedIn: 'root' })
export class CustResolve implements Resolve<ICust> {
    constructor(private service: CustService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICust> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Cust>) => response.ok),
                map((cust: HttpResponse<Cust>) => cust.body)
            );
        }
        return of(new Cust());
    }
}

export const custRoute: Routes = [
    {
        path: '',
        component: CustComponent,
        data: {
            // authorities: ['ROLE_USER'],
            pageTitle: 'Custs'
        },
        // canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CustDetailComponent,
        resolve: {
            cust: CustResolve
        },
        data: {
            // authorities: ['ROLE_USER'],
            pageTitle: 'Custs'
        },
        // canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CustUpdateComponent,
        resolve: {
            cust: CustResolve
        },
        data: {
            // authorities: ['ROLE_USER'],
            pageTitle: 'Custs'
        },
        // canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CustUpdateComponent,
        resolve: {
            cust: CustResolve
        },
        data: {
            // authorities: ['ROLE_USER'],
            pageTitle: 'Custs'
        },
        // canActivate: [UserRouteAccessService]
    }
];

export const custPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: CustDeletePopupComponent,
        resolve: {
            cust: CustResolve
        },
        data: {
            // authorities: ['ROLE_USER'],
            pageTitle: 'Custs'
        },
        // canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
