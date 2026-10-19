import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActaWizardComponent } from './features/actas/acta-wizard/Interface/acta-wizard.component';
import { LayoutComponent } from './layout/Interface/layout.component';
import { AgendaComponent } from './pages/agenda/Interface/agenda.component';
import { CorreoComponent } from './pages/correo/Interface/correo.component';
import { FirmaComponent } from './pages/firma/Interface/firma.component';
import { PanelComponent } from './pages/panel/Interface/panel.component';
import { TramitesComponent } from './pages/tramites/Interface/tramites.component';
import { VerificadorComponent } from './pages/verificador/Interface/verificador.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'panel', component: PanelComponent },
      { path: 'actas', component: ActaWizardComponent },
      { path: 'verificador', component: VerificadorComponent },
      { path: 'firma', component: FirmaComponent },
      { path: 'agenda', redirectTo: 'agenda/academico', pathMatch: 'full' },
      { path: 'agenda/:tipo', component: AgendaComponent },
      { path: 'tramites', component: TramitesComponent },
      { path: 'correo', component: CorreoComponent },
    ],
  },

  /* Rutas heredadas del flujo lineal por pasos: ahora viven en el wizard. */
  { path: 'dashboard', redirectTo: 'panel', pathMatch: 'full' },
  { path: 'carga', redirectTo: 'actas', pathMatch: 'full' },
  { path: 'validar', redirectTo: 'actas', pathMatch: 'full' },
  { path: 'plantilla', redirectTo: 'actas', pathMatch: 'full' },
  { path: 'exportar', redirectTo: 'actas', pathMatch: 'full' },

  { path: '**', redirectTo: 'panel' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
