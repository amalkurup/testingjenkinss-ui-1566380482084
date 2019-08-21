import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICust } from 'app/shared/model/cust.model';

@Component({
    selector: 'jhi-cust-detail',
    templateUrl: './cust-detail.component.html'
})
export class CustDetailComponent implements OnInit {
    cust: ICust;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cust }) => {
            this.cust = cust;
        });
    }

    previousState() {
        window.history.back();
    }
}
