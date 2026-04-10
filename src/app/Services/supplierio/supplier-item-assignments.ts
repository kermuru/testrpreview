import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplierAssignableItem, SupplierAssignableMapping, SupplierAssignableSupplier } from '../../Models/supplierio/supplierio.models';

@Injectable({ providedIn: 'root' })
export class SupplierItemAssignmentsService {
  private readonly baseUrl = `${environment.apiUrl}/supplierio`;

  constructor(private http: HttpClient) {}

  getAssignableSuppliers(): Observable<SupplierAssignableSupplier[]> {
    return this.http.get<SupplierAssignableSupplier[]>(`${this.baseUrl}/assignable-suppliers`);
  }

  getAssignableItems(): Observable<SupplierAssignableItem[]> {
    return this.http.get<SupplierAssignableItem[]>(`${this.baseUrl}/assignable-items`);
  }

  getSelectedSupplierItems(): Observable<SupplierAssignableMapping[]> {
    return this.http.get<SupplierAssignableMapping[]>(`${this.baseUrl}/selected-items`);
  }

  createSupplierItemAssignment(payload: { bpar_i_person_id: number; s_bpartner_id: number; supplier_item_id: number }): Observable<{ message: string; record: SupplierAssignableMapping }> {
    return this.http.post<{ message: string; record: SupplierAssignableMapping }>(`${this.baseUrl}/selected-items`, payload);
  }

  deleteSupplierItemAssignment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/selected-items/${id}`);
  }
}
