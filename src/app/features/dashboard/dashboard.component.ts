import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router} from '@angular/router';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { After } from 'v8';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/models/product.interface';
import { ProductoService } from '../../core/services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductoDetalleComponent } from '../producto-detalle/producto-detalle.component';
import { ProductoAgregarComponent } from '../producto-agregar/producto-agregar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent, FormsModule, ReactiveFormsModule, CurrencyPipe],
  providers: [
    StorageService
    
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private productService = inject(ProductoService);
  private authService = inject(AuthService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  matriculoMaterias: boolean = false;
  totalProductos: number = 0;
  totalCategorias: number = 0;
  paginatedData: Product[]= [];
  productsList: Product[] = []; 
  userInfo: any = {};
  displayedColumns: string[] = [
    'SKU',
    'Nombre',
    'Marca',
    'Categoria',
    'Precio',
  ];
  
  ngOnInit(): void {
    // this.crearFormulario();
    this.obtenerListadoProductos();
    this.obtenerCategoriasProducto();
    this.informacionUsuario()
  }

  informacionUsuario(){
    this.authService.obtenerInformacionUsuario().subscribe({
      next: (response) => {
        this.userInfo = response;
      },
      error: (error) => {
        console.error('Error al obtener informacion del usuario', error);
      },
    });
  }


  navigateTo(urlToNavigate: string, id?: number) {
    console.log('urlToNavigate');
    this.router.navigate([`/${urlToNavigate}`]);
  }

  // Pagination
  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.productsList.slice(start, end);
  }

  generatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  obtenerListadoProductos() {
    this.productService.obtenerListadoProductos().subscribe({
      next: (response) => {
        this.productsList = response.products.filter(product => !product.isDeleted);
        console.log('this.productsList', this.productsList);
        this.totalPages = Math.ceil(
          this.productsList.length / this.pageSize
        );
        this.currentPage = 1;
        this.updatePaginatedData();
        this.generatePages();
        this.totalProductos = this.sumarProductos();
        // this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener listado de productos', error);
      },
    });
  }

  obtenerCategoriasProducto() {
    this.productService.obtenerCategoriasProducto().subscribe({
      next: (response) => {
        this.totalCategorias = response.length;
      },
      error: (error) => {
        console.error('Error al obtener listado de categorias', error);
      },
    });
  }

  eliminar(index: number, productoId: number) {
    Swal.fire({
      title: '¿Estas seguro de eliminar el producto?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // remover la materia de la lista principal
        this.eliminarProducto(index, productoId);
      } else if (result.isDenied) {
        Swal.fire('el producto no se eliminó', '', 'info');
      }
    });
  }

  eliminarProducto(index: number, productoId: number) {
    this.productService.eliminarProducto(productoId).subscribe({
      next: (response) => {
        if (response) {
          this.productsList.splice(index, 1);
          this.paginatedData.splice(index, 1);
          // sumar creditos
          this.totalProductos = this.sumarProductos();
      
        }
      },
      error: (error: any) => {
        console.error('Error al eliminar productos', error);
      },
    });
  }

   sumarProductos() {
    let totalProductos = 0;
    this.productsList.forEach((producto) => {
      totalProductos += 1;
    });
    return totalProductos;
  }

   mostrarDetalle(item: Product) {
    const dialogRef = this.dialog.open(ProductoDetalleComponent, {
      height: '500px',
      width: '600px',
      data: { ...item },
    });

    dialogRef.disableClose = true;
  }

  agregarProducto() {
     const dialogRef = this.dialog.open(ProductoAgregarComponent, {
      height: '600px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsList.push(result);
        this.paginatedData.push(result);
        this.totalProductos = this.sumarProductos();
        this.cdr.detectChanges();
      }
    })

    dialogRef.disableClose = true;
  }


  
}
