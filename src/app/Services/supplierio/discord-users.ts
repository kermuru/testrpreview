import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BparDiscordUserIO, BparDiscordUserIOResponse, BparDropdownRecord } from '../../Models/supplierio/supplierio.models';

@Injectable({ providedIn: 'root' })
export class DiscordUsersService {
  private readonly baseUrl = `${environment.apiUrl}/supplierio/discord`;

  constructor(private http: HttpClient) {}

  getBparDropdownList(): Observable<BparDropdownRecord[]> {
    return this.http.get<BparDropdownRecord[]>(`${this.baseUrl}/bpar-list`);
  }

  getDiscordUserByBparId(bparId: number): Observable<BparDiscordUserIO> {
    return this.http.get<BparDiscordUserIO>(`${this.baseUrl}/${bparId}`);
  }

  createDiscordUser(payload: { bpar_i_person_id: number; s_bpartner_id?: number | null; discord_user_id: string }): Observable<BparDiscordUserIOResponse> {
    return this.http.post<BparDiscordUserIOResponse>(this.baseUrl, payload);
  }

  updateDiscordUser(bparId: number, payload: { s_bpartner_id?: number | null; discord_user_id: string }): Observable<BparDiscordUserIOResponse> {
    return this.http.put<BparDiscordUserIOResponse>(`${this.baseUrl}/${bparId}`, payload);
  }

  deleteDiscordUser(bparId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${bparId}`);
  }
}
