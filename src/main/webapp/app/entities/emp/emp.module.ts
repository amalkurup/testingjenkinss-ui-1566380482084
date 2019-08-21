import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiapplicationSharedModule } from 'app/shared';
import {
    EmpComponent,
    EmpDetailComponent,
    EmpUpdateComponent,
    EmpDeletePopupComponent,
    EmpDeleteDialogComponent,
    empRoute,
    empPopupRoute
} from './';

const ENTITY_STATES = [...empRoute, ...empPopupRoute];

@NgModule({
    imports: [UiapplicationSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [EmpComponent, EmpDetailComponent, EmpUpdateComponent, EmpDeleteDialogComponent, EmpDeletePopupComponent],
    entryComponents: [EmpComponent, EmpUpdateComponent, EmpDeleteDialogComponent, EmpDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UiapplicationEmpModule {}
