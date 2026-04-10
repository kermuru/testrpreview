import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BparDiscordUserIO, BparDropdownRecord } from '../../../Models/supplierio/supplierio.models';
import { DiscordUsersService } from '../../../Services/supplierio/discord-users';

@Component({
  selector: 'app-discord-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './discord.html',
  styleUrl: './discord.scss'
})
export class DiscordUserComponent implements OnInit {
  bparOptions: BparDropdownRecord[] = [];
  selectedBparId = '';
  sBpartnerId = '';
  discordUserId = '';
  record: BparDiscordUserIO | null = null;
  loading = false;
  saving = false;
  error = '';
  message = '';

  constructor(private readonly discordUsersService: DiscordUsersService) {}

  ngOnInit(): void {
    this.discordUsersService.getBparDropdownList().subscribe({
      next: (data) => { this.bparOptions = data; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to load BPAR list.'; }
    });
  }

  get selectedBpar(): BparDropdownRecord | null {
    return this.bparOptions.find((item) => String(item.bpar_i_person_id) === this.selectedBparId) || null;
  }

  onBparChange(): void {
    if (!this.selectedBparId) {
      this.record = null;
      this.sBpartnerId = '';
      this.discordUserId = '';
      return;
    }

    if (this.selectedBpar) {
      this.sBpartnerId = String(this.selectedBpar.s_bpartner_id ?? '');
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.discordUsersService.getDiscordUserByBparId(Number(this.selectedBparId)).subscribe({
      next: (data) => {
        this.record = data;
        this.discordUserId = data.discord_user_id;
        this.sBpartnerId = String(data.s_bpartner_id ?? this.selectedBpar?.s_bpartner_id ?? '');
        this.loading = false;
      },
      error: (err) => {
        this.record = null;
        this.discordUserId = '';
        if (err?.status !== 404) {
          this.error = err?.error?.message || err?.message || 'Failed to fetch Discord user record.';
        }
        this.loading = false;
      }
    });
  }

  handleSave(): void {
    if (!this.selectedBparId || !this.discordUserId.trim()) {
      this.error = 'Please select BPAR name and enter discord_user_id.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    const payload = {
      bpar_i_person_id: Number(this.selectedBparId),
      s_bpartner_id: this.sBpartnerId.trim() ? Number(this.sBpartnerId) : null,
      discord_user_id: this.discordUserId.trim()
    };

    const request$ = this.record
      ? this.discordUsersService.updateDiscordUser(Number(this.selectedBparId), {
          s_bpartner_id: payload.s_bpartner_id,
          discord_user_id: payload.discord_user_id
        })
      : this.discordUsersService.createDiscordUser(payload);

    request$.subscribe({
      next: (response) => {
        this.record = response.record;
        this.message = response.message;
        this.saving = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to save Discord user record.';
        this.saving = false;
      }
    });
  }

  handleDelete(): void {
    if (!this.selectedBparId) {
      this.error = 'Please select a BPAR name.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    this.discordUsersService.deleteDiscordUser(Number(this.selectedBparId)).subscribe({
      next: (response) => {
        this.record = null;
        this.discordUserId = '';
        this.message = response.message;
        this.saving = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to delete Discord user record.';
        this.saving = false;
      }
    });
  }
}
