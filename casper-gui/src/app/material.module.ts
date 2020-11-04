import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatDialogModule} from '@angular/material/dialog'
import {MatSelectModule} from '@angular/material/select'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}
