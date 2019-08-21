import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEmp } from 'app/shared/model/emp.model';
import { EmpService } from './emp.service';

@Component({
    selector: 'jhi-emp-delete-dialog',
    templateUrl: './emp-delete-dialog.component.html'
})
export class EmpDeleteDialogComponent {
    emp: IEmp;

    constructor(protected empService: EmpService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.empService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'empListModification',
                content: 'Deleted an emp'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-emp-delete-popup',
    template: ''
})
export class EmpDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ emp }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EmpDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.emp = emp;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/emp', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/emp', { outlets: { popup: null } }]);
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
