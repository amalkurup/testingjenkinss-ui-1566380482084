import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiapplicationSharedModule } from 'app/shared';
import {
    CustComponent,
    CustDetailComponent,
    CustUpdateComponent,
    CustDeletePopupComponent,
    CustDeleteDialogComponent,
    custRoute,
    custPopupRoute
} from './';

const ENTITY_STATES = [...custRoute, ...custPopupRoute];

@NgModule({
    imports: [UiapplicationSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CustComponent, CustDetailComponent, CustUpdateComponent, CustDeleteDialogComponent, CustDeletePopupComponent],
    entryComponents: [CustComponent, CustUpdateComponent, CustDeleteDialogComponent, CustDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UiapplicationCustModule {}
