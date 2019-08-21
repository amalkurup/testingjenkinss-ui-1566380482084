/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { UiapplicationTestModule } from '../../../test.module';
import { CustComponent } from 'app/entities/cust/cust.component';
import { CustService } from 'app/entities/cust/cust.service';
import { Cust } from 'app/shared/model/cust.model';

describe('Component Tests', () => {
    describe('Cust Management Component', () => {
        let comp: CustComponent;
        let fixture: ComponentFixture<CustComponent>;
        let service: CustService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [UiapplicationTestModule],
                declarations: [CustComponent],
                providers: []
            })
                .overrideTemplate(CustComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CustComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CustService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Cust(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.custs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
