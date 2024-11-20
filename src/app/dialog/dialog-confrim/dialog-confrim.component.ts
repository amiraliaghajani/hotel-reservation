import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-confrim',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,

  ],
  templateUrl: './dialog-confrim.component.html',
  styleUrl: './dialog-confrim.component.css'
})
export class DialogConfrimComponent {
  constructor(public dialogRef: MatDialogRef<DialogConfrimComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without confirming
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Close the dialog and return true
  }


}
