import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICust } from 'app/shared/model/cust.model';
import { AccountService } from 'app/core';
import { CustService } from './cust.service';

@Component({
    selector: 'jhi-cust',
    templateUrl: './cust.component.html'
})
export class CustComponent implements OnInit, OnDestroy {
    custs: ICust[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected custService: CustService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.custService
            .query()
            .pipe(
                filter((res: HttpResponse<ICust[]>) => res.ok),
                map((res: HttpResponse<ICust[]>) => res.body)
            )
            .subscribe(
                (res: ICust[]) => {
                    this.custs = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCusts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICust) {
        return item.id;
    }

    registerChangeInCusts() {
        this.eventSubscriber = this.eventManager.subscribe('custListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
