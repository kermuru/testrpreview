import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupplierItemIO } from '../../../Models/supplierio/supplierio.models';
import { SupplierItemsService } from '../../../Services/supplierio/supplier-items';

@Component({
  selector: 'app-supplier-items',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './items.html',
  styleUrl: './items.scss'
})
export class SupplierItemsComponent implements OnInit {
  items: SupplierItemIO[] = [];
  loading = true;
  saving = false;
  editingId: number | null = null;

  itemName = '';
  itemCategory = '';
  isActive = true;

  error = '';
  message = '';

  constructor(private readonly supplierItemsService: SupplierItemsService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.supplierItemsService.getSupplierItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load items.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.itemName = '';
    this.itemCategory = '';
    this.isActive = true;
  }

  handleEdit(item: SupplierItemIO): void {
    this.editingId = item.id;
    this.itemName = item.item_name;
    this.itemCategory = item.item_category;
    this.isActive = Boolean(item.is_active);
  }

  handleSubmit(): void {
    if (!this.itemName.trim() || !this.itemCategory.trim()) {
      this.error = 'Please enter item name and category.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    const payload = {
      item_name: this.itemName.trim(),
      item_category: this.itemCategory.trim(),
      is_active: this.isActive
    };

    const request$ = this.editingId
      ? this.supplierItemsService.updateSupplierItem(this.editingId, payload)
      : this.supplierItemsService.createSupplierItem(payload);

    request$.subscribe({
      next: (response) => {
        this.message = response.message;
        this.resetForm();
        this.saving = false;
        this.loadItems();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to save supplier item.';
        this.saving = false;
      }
    });
  }

  handleDelete(id: number): void {
    this.error = '';
    this.message = '';
    this.supplierItemsService.deleteSupplierItem(id).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadItems();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to delete supplier item.';
      }
    });
  }
}
