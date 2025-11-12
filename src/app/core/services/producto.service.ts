import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal,} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product, ProductResponse } from '../../shared/models/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  obtenerListadoProductos(): Observable<ProductResponse> {
    const url = `${this.baseUrl}${environment.prefijos.products.getAll}`;
    return this.http.get<ProductResponse>(url)
  }

  obtenerProductoPorId(id: string): Observable<Product> {
    const url = `${this.baseUrl}${environment.prefijos.products.getById}/${id}`;
    return this.http.get<Product>(url)
  } 

  buscarProducto(nombre: string): Observable<Product> {
    const url = `${this.baseUrl}${environment.prefijos.products.search}${nombre}`;
    return this.http.get<Product>(url)
  } 

  obtenerCategoriasProducto(): Observable<string[]> {
    const url = `${this.baseUrl}${environment.prefijos.products.getCategories}`;
    return this.http.get<string[]>(url)
  } 

  agregarProducto(producto: Product): Observable<Product> {
    const url = `${this.baseUrl}${environment.prefijos.products.add}`;
    return this.http.post<Product>(url, producto);
  }

  eliminarProducto(productoId: number): Observable<any> {
    const url = `${this.baseUrl}${environment.prefijos.products.delete}${productoId}`;
    return this.http.delete<any>(url);
  }

 
 

}
