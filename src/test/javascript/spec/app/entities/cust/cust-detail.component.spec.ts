/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UiapplicationTestModule } from '../../../test.module';
import { CustDetailComponent } from 'app/entities/cust/cust-detail.component';
import { Cust } from 'app/shared/model/cust.model';

describe('Component Tests', () => {
    describe('Cust Management Detail Component', () => {
        let comp: CustDetailComponent;
        let fixture: ComponentFixture<CustDetailComponent>;
        const route = ({ data: of({ cust: new Cust(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [CustDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CustDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CustDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.cust).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
