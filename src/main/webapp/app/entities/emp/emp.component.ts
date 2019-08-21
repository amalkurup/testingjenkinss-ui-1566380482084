import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEmp } from 'app/shared/model/emp.model';
import { AccountService } from 'app/core';
import { EmpService } from './emp.service';

@Component({
    selector: 'jhi-emp',
    templateUrl: './emp.component.html'
})
export class EmpComponent implements OnInit, OnDestroy {
    emps: IEmp[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected empService: EmpService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.empService
            .query()
            .pipe(
                filter((res: HttpResponse<IEmp[]>) => res.ok),
                map((res: HttpResponse<IEmp[]>) => res.body)
            )
            .subscribe(
                (res: IEmp[]) => {
                    this.emps = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInEmps();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEmp) {
        return item.id;
    }

    registerChangeInEmps() {
        this.eventSubscriber = this.eventManager.subscribe('empListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
