import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICust } from 'app/shared/model/cust.model';
import { CustService } from './cust.service';

@Component({
    selector: 'jhi-cust-delete-dialog',
    templateUrl: './cust-delete-dialog.component.html'
})
export class CustDeleteDialogComponent {
    cust: ICust;

    constructor(protected custService: CustService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.custService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'custListModification',
                content: 'Deleted an cust'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cust-delete-popup',
    template: ''
})
export class CustDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cust }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CustDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.cust = cust;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/cust', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/cust', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
