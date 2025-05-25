import { Component, Inject, InjectionToken } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Message } from './chat.component';

export interface PinDialogData {
  access: string;
  title: string;
  description: string;
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatSelectModule,
    ReactiveFormsModule
  ],
  selector: 'app-pin-dialog',
  styleUrls: ['./pindialog.component.css'],
  templateUrl: './pindialog.component.html'
})
export class PinDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: Message }) { }
  pinForm = new FormGroup({
    access: new FormControl('public'),
    title: new FormControl(''),
    description: new FormControl('')
  });
}


