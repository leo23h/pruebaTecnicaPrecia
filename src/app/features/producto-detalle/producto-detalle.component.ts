import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../shared/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-producto-detalle',
  imports: [CurrencyPipe],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent {
  private dialogRef = inject(MatDialogRef<ProductoDetalleComponent>);
  public data = inject<Product>(MAT_DIALOG_DATA);
  public productInfo: Product = this.data;

  cerrarModal() {
    this.dialogRef.close();
  }
}
