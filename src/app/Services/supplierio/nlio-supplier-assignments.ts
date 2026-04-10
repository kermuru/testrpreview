import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NlioAssignmentRecord, NlioRecord, SupplierByItemRecord } from '../../Models/supplierio/supplierio.models';

@Injectable({ providedIn: 'root' })
export class NlioSupplierAssignmentsService {
  private readonly baseUrl = `${environment.apiUrl}/supplierio/nlio`;

  constructor(private http: HttpClient) {}

  getNlioByDocumentNo(documentNo: string): Observable<NlioRecord[]> {
    return this.http.get<NlioRecord[]>(`${this.baseUrl}/${encodeURIComponent(documentNo)}`);
  }

  getSuppliersByItem(supplierItemId: number | string): Observable<SupplierByItemRecord[]> {
    return this.http.get<SupplierByItemRecord[]>(`${this.baseUrl}/suppliers/by-item/${supplierItemId}`);
  }

  getAssignmentsByDocumentNo(documentNo: string): Observable<NlioAssignmentRecord[]> {
    return this.http.get<NlioAssignmentRecord[]>(`${this.baseUrl}/assignments/${encodeURIComponent(documentNo)}`);
  }

  createNlioAssignment(payload: { document_no: string; bpar_i_person_id: number; s_bpartner_id: number; supplier_item_id: number; assigned_by?: string }): Observable<{ message: string; assignment: NlioAssignmentRecord }> {
    return this.http.post<{ message: string; assignment: NlioAssignmentRecord }>(`${this.baseUrl}/assignments`, payload);
  }

  deleteNlioAssignment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/assignments/${id}`);
  }
}
