import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { CreateTransactionRequest } from '../models/transaction.model';
import { TransactionResponse } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private baseUrl = `${environment.apiUrl}/transaction`;

  constructor(private http: HttpClient) {}

  getCustomerTransactions(customerId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  recordTransaction(request: CreateTransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(this.baseUrl, request);
  }
}