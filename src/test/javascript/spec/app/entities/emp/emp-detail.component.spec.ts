/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UiapplicationTestModule } from '../../../test.module';
import { EmpDetailComponent } from 'app/entities/emp/emp-detail.component';
import { Emp } from 'app/shared/model/emp.model';

describe('Component Tests', () => {
    describe('Emp Management Detail Component', () => {
        let comp: EmpDetailComponent;
        let fixture: ComponentFixture<EmpDetailComponent>;
        const route = ({ data: of({ emp: new Emp(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [EmpDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(EmpDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EmpDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.emp).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
