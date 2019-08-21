import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmp } from 'app/shared/model/emp.model';

@Component({
    selector: 'jhi-emp-detail',
    templateUrl: './emp-detail.component.html'
})
export class EmpDetailComponent implements OnInit {
    emp: IEmp;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ emp }) => {
            this.emp = emp;
        });
    }

    previousState() {
        window.history.back();
    }
}
