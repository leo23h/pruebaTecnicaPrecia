import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../shared/models/product.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductoService } from '../../core/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-agregar',
  imports: [MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './producto-agregar.component.html',
  styleUrl: './producto-agregar.component.css',
})
export class ProductoAgregarComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ProductoAgregarComponent>);
  private productService = inject(ProductoService)
  // variables
  productForm!: FormGroup;
  categoriasList: string[] = [];

  ngOnInit(): void {
    this.crearFormularioRegistro();
    this.obtenerCategoriasProducto()
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  crearFormularioRegistro() {
    this.productForm = new FormGroup({
      sku: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    });
  }

    obtenerCategoriasProducto() {
    this.productService.obtenerCategoriasProducto().subscribe({
      next: (response) => {
        this.categoriasList = response;
      },
      error: (error) => {
        console.error('Error al obtener listado de categorias', error);
      },
    });
  }

   guardar() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      console.log('Formulario de ingreso válido:', this.productForm.value);
      this.guardarProducto();
      // this.navigateTo('dashboard');
    }
  }


  guardarProducto() {
        this.productService.agregarProducto(this.productForm.value).subscribe({
          next: (response) => {
            console.log('Producto registrado:', response);
            this.dialogRef.close({...this.productForm.value, id: response.id});
            Swal.fire({
              title: 'Éxito!',
              text: 'Producto guardado correctamente',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            this.productForm.reset(); 
            
          },
          error: (error) => {
            console.error('Error al registrar producto:', error);
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo registrar el producto',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    
}
