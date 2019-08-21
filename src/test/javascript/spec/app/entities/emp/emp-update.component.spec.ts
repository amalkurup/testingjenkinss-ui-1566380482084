/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { UiapplicationTestModule } from '../../../test.module';
import { EmpUpdateComponent } from 'app/entities/emp/emp-update.component';
import { EmpService } from 'app/entities/emp/emp.service';
import { Emp } from 'app/shared/model/emp.model';

describe('Component Tests', () => {
    describe('Emp Management Update Component', () => {
        let comp: EmpUpdateComponent;
        let fixture: ComponentFixture<EmpUpdateComponent>;
        let service: EmpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [EmpUpdateComponent]
            })
                .overrideTemplate(EmpUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EmpUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EmpService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Emp(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.emp = entity;
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
                    const entity = new Emp();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.emp = entity;
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
