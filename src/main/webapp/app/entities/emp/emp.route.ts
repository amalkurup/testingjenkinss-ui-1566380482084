import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Emp } from 'app/shared/model/emp.model';
import { EmpService } from './emp.service';
import { EmpComponent } from './emp.component';
import { EmpDetailComponent } from './emp-detail.component';
import { EmpUpdateComponent } from './emp-update.component';
import { EmpDeletePopupComponent } from './emp-delete-dialog.component';
import { IEmp } from 'app/shared/model/emp.model';

@Injectable({ providedIn: 'root' })
export class EmpResolve implements Resolve<IEmp> {
    constructor(private service: EmpService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmp> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Emp>) => response.ok),
                map((emp: HttpResponse<Emp>) => emp.body)
            );
        }
        return of(new Emp());
    }
}

export const empRoute: Routes = [
    {
        path: '',
        component: EmpComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Emps'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: EmpDetailComponent,
        resolve: {
            emp: EmpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Emps'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: EmpUpdateComponent,
        resolve: {
            emp: EmpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Emps'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: EmpUpdateComponent,
        resolve: {
            emp: EmpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Emps'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const empPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: EmpDeletePopupComponent,
        resolve: {
            emp: EmpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Emps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
