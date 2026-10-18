import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ActaWizardComponent } from './features/actas/acta-wizard/Interface/acta-wizard.component';
import { ActasIndexTableComponent } from './features/actas/components/actas-index-table/Interface/actas-index-table.component';
import { ActaPreviewComponent } from './features/actas/components/acta-preview/Interface/acta-preview.component';
import { StepExportComponent } from './pages/paso-4-exportacion/Interface/step-export.component';
import { StepTemplateComponent } from './pages/paso-3-plantilla/Interface/step-template.component';
import { StepUploadComponent } from './pages/paso-1-carga/Interface/step-upload.component';
import { StepValidateComponent } from './pages/paso-2-validacion/Interface/step-validate.component';
import { StudentEditDialogComponent } from './features/actas/components/student-edit-dialog/Interface/student-edit-dialog.component';
import { StudentsTableComponent } from './features/actas/components/students-table/Interface/students-table.component';
import { HeaderComponent } from './shared/components/header/Interface/header.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/Interface/loading-screen.component';
import { DashboardComponent } from './pages/dashboard/Interface/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadingScreenComponent,    ActaWizardComponent,
    StepUploadComponent,
    StepValidateComponent,
    StepTemplateComponent,
    StepExportComponent,
    StudentsTableComponent,
    StudentEditDialogComponent,
    ActaPreviewComponent,
    ActasIndexTableComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AvatarModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    ProgressBarModule,
    SelectButtonModule,
    StepsModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
