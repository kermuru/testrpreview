import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplierItemIO, SupplierItemIOResponse } from '../../Models/supplierio/supplierio.models';

@Injectable({ providedIn: 'root' })
export class SupplierItemsService {
  private readonly baseUrl = `${environment.apiUrl}/supplierio/items`;

  constructor(private http: HttpClient) {}

  getSupplierItems(): Observable<SupplierItemIO[]> {
    return this.http.get<SupplierItemIO[]>(this.baseUrl);
  }

  createSupplierItem(payload: { item_name: string; item_category: string; is_active: boolean }): Observable<SupplierItemIOResponse> {
    return this.http.post<SupplierItemIOResponse>(this.baseUrl, payload);
  }

  updateSupplierItem(id: number, payload: { item_name: string; item_category: string; is_active: boolean }): Observable<SupplierItemIOResponse> {
    return this.http.put<SupplierItemIOResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deleteSupplierItem(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
