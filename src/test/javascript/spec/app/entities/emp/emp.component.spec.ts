/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { UiapplicationTestModule } from '../../../test.module';
import { EmpComponent } from 'app/entities/emp/emp.component';
import { EmpService } from 'app/entities/emp/emp.service';
import { Emp } from 'app/shared/model/emp.model';

describe('Component Tests', () => {
    describe('Emp Management Component', () => {
        let comp: EmpComponent;
        let fixture: ComponentFixture<EmpComponent>;
        let service: EmpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [EmpComponent],
                providers: []
            })
                .overrideTemplate(EmpComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EmpComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EmpService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Emp(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.emps[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
