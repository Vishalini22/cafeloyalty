import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  // Assumes the GET /api/customer/me self-lookup endpoint mentioned in your Day 4 plan.
  // If that route ended up with a different path, update it here only.
  getMe(): Observable<Customer> {
    return this.http.get<Customer>(`${environment.apiUrl}/customer/me`);
  }

  getAllCustomers(): Observable<Customer[]> {
  return this.http.get<Customer[]>(`${environment.apiUrl}/customer/all`);
}

  // getTransactions(customerId: number): Observable<Transaction[]> {
  //   return this.http.get<Transaction[]>(`${environment.apiUrl}/transaction/customer/${customerId}`);
  // }

  // createTransaction(request: CreateTransactionRequest): Observable<CreateTransactionResponse> {
  //   return this.http.post<CreateTransactionResponse>(`${environment.apiUrl}/transaction`, request);
  // }
}
