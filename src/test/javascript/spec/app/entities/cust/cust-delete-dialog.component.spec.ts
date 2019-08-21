/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { UiapplicationTestModule } from '../../../test.module';
import { CustDeleteDialogComponent } from 'app/entities/cust/cust-delete-dialog.component';
import { CustService } from 'app/entities/cust/cust.service';

describe('Component Tests', () => {
    describe('Cust Management Delete Component', () => {
        let comp: CustDeleteDialogComponent;
        let fixture: ComponentFixture<CustDeleteDialogComponent>;
        let service: CustService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [CustDeleteDialogComponent]
            })
                .overrideTemplate(CustDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CustDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CustService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
