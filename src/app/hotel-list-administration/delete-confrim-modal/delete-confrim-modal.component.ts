import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-delete-confrim-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './delete-confrim-modal.component.html',
  styleUrl: './delete-confrim-modal.component.css'
})
export class DeleteConfrimModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfrimModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
