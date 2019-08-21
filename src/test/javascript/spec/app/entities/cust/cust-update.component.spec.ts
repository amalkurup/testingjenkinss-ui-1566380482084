/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { UiapplicationTestModule } from '../../../test.module';
import { CustUpdateComponent } from 'app/entities/cust/cust-update.component';
import { CustService } from 'app/entities/cust/cust.service';
import { Cust } from 'app/shared/model/cust.model';

describe('Component Tests', () => {
    describe('Cust Management Update Component', () => {
        let comp: CustUpdateComponent;
        let fixture: ComponentFixture<CustUpdateComponent>;
        let service: CustService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [CustUpdateComponent]
            })
                .overrideTemplate(CustUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CustUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CustService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Cust(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cust = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Cust();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cust = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
