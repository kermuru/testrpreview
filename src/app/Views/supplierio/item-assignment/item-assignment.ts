import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SupplierAssignableItem, SupplierAssignableMapping, SupplierAssignableSupplier } from '../../../Models/supplierio/supplierio.models';
import { SupplierItemAssignmentsService } from '../../../Services/supplierio/supplier-item-assignments';

@Component({
  selector: 'app-supplier-item-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './item-assignment.html',
  styleUrl: './item-assignment.scss'
})
export class SupplierItemAssignmentComponent implements OnInit {
  suppliers: SupplierAssignableSupplier[] = [];
  items: SupplierAssignableItem[] = [];
  records: SupplierAssignableMapping[] = [];
  loading = true;
  saving = false;
  error = '';
  message = '';
  selectedBparId = '';
  selectedItemId = '';

  constructor(private readonly assignmentsService: SupplierItemAssignmentsService) {}

  ngOnInit(): void {
    this.load();
  }

  get uniqueSuppliers(): SupplierAssignableSupplier[] {
    const seen = new Set<string>();
    return this.suppliers.filter((supplier) => {
      const key = `${supplier.bpar_i_person_id}-${supplier.s_bpartner_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  get selectedSupplier(): SupplierAssignableSupplier | null {
    return this.uniqueSuppliers.find((supplier) => String(supplier.bpar_i_person_id) === this.selectedBparId) || null;
  }

  load(): void {
    this.loading = true;
    this.error = '';
    Promise.all([
      lastValueFrom(this.assignmentsService.getAssignableSuppliers()),
      lastValueFrom(this.assignmentsService.getAssignableItems()),
      lastValueFrom(this.assignmentsService.getSelectedSupplierItems())
    ]).then(([suppliers, items, records]) => {
      this.suppliers = suppliers || [];
      this.items = items || [];
      this.records = records || [];
      this.loading = false;
    }).catch((err) => {
      this.error = err?.error?.message || err?.message || 'Failed to load supplier item assignment data.';
      this.loading = false;
    });
  }

  refreshRecords(): void {
    this.assignmentsService.getSelectedSupplierItems().subscribe({
      next: (records) => { this.records = records; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to refresh assignments.'; }
    });
  }

  handleAssign(): void {
    if (!this.selectedSupplier || !this.selectedItemId) {
      this.error = 'Please select both supplier and item.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    this.assignmentsService.createSupplierItemAssignment({
      bpar_i_person_id: this.selectedSupplier.bpar_i_person_id,
      s_bpartner_id: this.selectedSupplier.s_bpartner_id,
      supplier_item_id: Number(this.selectedItemId)
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.selectedItemId = '';
        this.saving = false;
        this.refreshRecords();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to assign item to supplier.';
        this.saving = false;
      }
    });
  }

  handleDelete(id: number): void {
    this.error = '';
    this.message = '';
    this.assignmentsService.deleteSupplierItemAssignment(id).subscribe({
      next: (response) => {
        this.message = response.message;
        this.refreshRecords();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to delete supplier item assignment.';
      }
    });
  }
}
