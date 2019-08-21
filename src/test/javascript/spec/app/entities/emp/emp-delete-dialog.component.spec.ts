/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { UiapplicationTestModule } from '../../../test.module';
import { EmpDeleteDialogComponent } from 'app/entities/emp/emp-delete-dialog.component';
import { EmpService } from 'app/entities/emp/emp.service';

describe('Component Tests', () => {
    describe('Emp Management Delete Component', () => {
        let comp: EmpDeleteDialogComponent;
        let fixture: ComponentFixture<EmpDeleteDialogComponent>;
        let service: EmpService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [EmpDeleteDialogComponent]
            })
                .overrideTemplate(EmpDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EmpDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EmpService);
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
