import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SupplierAssignableItem, SupplierByItemRecord, NlioAssignmentRecord, NlioRecord } from '../../../Models/supplierio/supplierio.models';
import { SupplierItemAssignmentsService } from '../../../Services/supplierio/supplier-item-assignments';
import { NlioSupplierAssignmentsService } from '../../../Services/supplierio/nlio-supplier-assignments';

@Component({
  selector: 'app-nlio-supplier-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './nlio-assignment.html',
  styleUrl: './nlio-assignment.scss'
})
export class NlioSupplierAssignmentComponent implements OnInit {
  documentNo = '';
  assignedBy = '';
  items: SupplierAssignableItem[] = [];
  suppliers: SupplierByItemRecord[] = [];
  nlioRecords: NlioRecord[] = [];
  assignments: NlioAssignmentRecord[] = [];
  selectedItemId = '';
  selectedSupplierKey = '';
  loading = false;
  saving = false;
  error = '';
  message = '';

  constructor(
    private readonly supplierItemAssignmentsService: SupplierItemAssignmentsService,
    private readonly nlioSupplierAssignmentsService: NlioSupplierAssignmentsService
  ) {}

  ngOnInit(): void {
    this.supplierItemAssignmentsService.getAssignableItems().subscribe({
      next: (items) => { this.items = items; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to load supplier items.'; }
    });
  }

  handleSearch(): void {
    if (!this.documentNo.trim()) {
      this.error = 'Please enter a document number.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';
    this.selectedSupplierKey = '';

    Promise.all([
      lastValueFrom(this.nlioSupplierAssignmentsService.getNlioByDocumentNo(this.documentNo.trim())),
      lastValueFrom(this.nlioSupplierAssignmentsService.getAssignmentsByDocumentNo(this.documentNo.trim()))
    ]).then(([nlioData, assignmentData]) => {
      this.nlioRecords = nlioData || [];
      this.assignments = assignmentData || [];
      this.loading = false;
    }).catch((err) => {
      this.nlioRecords = [];
      this.assignments = [];
      this.error = err?.error?.message || err?.message || 'Failed to fetch NLIO record.';
      this.loading = false;
    });
  }

  handleItemChange(itemId: string): void {
    this.selectedItemId = itemId;
    this.selectedSupplierKey = '';
    this.suppliers = [];
    this.error = '';

    if (!itemId) return;

    this.nlioSupplierAssignmentsService.getSuppliersByItem(Number(itemId)).subscribe({
      next: (suppliers) => { this.suppliers = suppliers; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to fetch suppliers for item.'; }
    });
  }

  refreshAssignments(): void {
    if (!this.documentNo.trim()) return;
    this.nlioSupplierAssignmentsService.getAssignmentsByDocumentNo(this.documentNo.trim()).subscribe({
      next: (assignments) => { this.assignments = assignments; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to refresh assignments.'; }
    });
  }

  handleAssign(): void {
    if (!this.documentNo.trim()) {
      this.error = 'Please search an NLIO first.';
      return;
    }

    if (!this.selectedItemId || !this.selectedSupplierKey) {
      this.error = 'Please select an item and supplier.';
      return;
    }

    const [bparId, partnerId] = this.selectedSupplierKey.split('|');

    this.saving = true;
    this.error = '';
    this.message = '';

    this.nlioSupplierAssignmentsService.createNlioAssignment({
      document_no: this.documentNo.trim(),
      bpar_i_person_id: Number(bparId),
      s_bpartner_id: Number(partnerId),
      supplier_item_id: Number(this.selectedItemId),
      assigned_by: this.assignedBy.trim() || undefined
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.selectedSupplierKey = '';
        this.saving = false;
        this.refreshAssignments();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to assign supplier to NLIO.';
        this.saving = false;
      }
    });
  }

  handleDelete(id: number): void {
    this.error = '';
    this.message = '';
    this.nlioSupplierAssignmentsService.deleteNlioAssignment(id).subscribe({
      next: (response) => {
        this.message = response.message;
        this.refreshAssignments();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to delete NLIO assignment.';
      }
    });
  }
}
