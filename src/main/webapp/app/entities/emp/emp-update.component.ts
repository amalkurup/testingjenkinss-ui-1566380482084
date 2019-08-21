import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IEmp } from 'app/shared/model/emp.model';
import { EmpService } from './emp.service';

@Component({
    selector: 'jhi-emp-update',
    templateUrl: './emp-update.component.html'
})
export class EmpUpdateComponent implements OnInit {
    emp: IEmp;
    isSaving: boolean;

    constructor(protected empService: EmpService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ emp }) => {
            this.emp = emp;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.emp.id !== undefined) {
            this.subscribeToSaveResponse(this.empService.update(this.emp));
        } else {
            this.subscribeToSaveResponse(this.empService.create(this.emp));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmp>>) {
        result.subscribe((res: HttpResponse<IEmp>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
