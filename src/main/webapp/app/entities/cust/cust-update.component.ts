import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ICust } from 'app/shared/model/cust.model';
import { CustService } from './cust.service';

@Component({
    selector: 'jhi-cust-update',
    templateUrl: './cust-update.component.html'
})
export class CustUpdateComponent implements OnInit {
    cust: ICust;
    isSaving: boolean;

    constructor(protected custService: CustService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cust }) => {
            this.cust = cust;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.cust.id !== undefined) {
            this.subscribeToSaveResponse(this.custService.update(this.cust));
        } else {
            this.subscribeToSaveResponse(this.custService.create(this.cust));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICust>>) {
        result.subscribe((res: HttpResponse<ICust>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
