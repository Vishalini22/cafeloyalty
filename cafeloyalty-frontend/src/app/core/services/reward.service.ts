import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reward, CreateRewardRequest } from '../models/reward.model';
import { CreateRedemptionRequest, RedemptionResponse, Redemption } from '../models/redemption.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  constructor(private http: HttpClient) { }

  getActiveRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${environment.apiUrl}/reward`);
  }

  // Admin only — backend enforces via [Authorize(Roles = "Admin")]
  createReward(request: CreateRewardRequest): Observable<Reward> {
    return this.http.post<Reward>(`${environment.apiUrl}/reward`, request);
  }

  redeem(request: CreateRedemptionRequest): Observable<RedemptionResponse> {
    return this.http.post<RedemptionResponse>(`${environment.apiUrl}/redemption`, request);
  }

  getCustomerRedemptions(customerId: number): Observable<Redemption[]> {
    return this.http.get<Redemption[]>(`${environment.apiUrl}/redemption/customer/${customerId}`);
  }

  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${environment.apiUrl}/reward/all`);
  }

}