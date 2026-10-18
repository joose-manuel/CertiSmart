import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActaWizardComponent } from './features/actas/acta-wizard/Interface/acta-wizard.component';
import { DashboardComponent } from './pages/dashboard/Interface/dashboard.component';
import { StepExportComponent } from './pages/paso-4-exportacion/Interface/step-export.component';
import { StepTemplateComponent } from './pages/paso-3-plantilla/Interface/step-template.component';
import { StepUploadComponent } from './pages/paso-1-carga/Interface/step-upload.component';
import { StepValidateComponent } from './pages/paso-2-validacion/Interface/step-validate.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'carga', component: StepUploadComponent },
  { path: 'validar', component: StepValidateComponent },
  { path: 'plantilla', component: StepTemplateComponent },
  { path: 'exportar', component: StepExportComponent },
  { path: 'actas', component: ActaWizardComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
