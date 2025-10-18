import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardModel } from '../../models/dashboard-model';

export interface DocumentMeta {
  document_id: string;
  file_name: string;
  is_tax_related?: boolean; 
  due_date?: string;        
  is_payment?: number;
}

interface ListResponse {
  metadatas: Array<{ document_id: string; file_name: string }>;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  viewDocument(documentId: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = environment.apiUrl; // مثل http://127.0.0.1:8000

  constructor(private http: HttpClient) {}

  /** لیست اسناد */
  listDocuments(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(`${this.baseUrl}/dashboard`);
  }

  /** آپلود PDF */
  uploadDocument(file: File): Observable<any> {
    const form = new FormData();
    // اگر بک‌اند نام فیلد دیگری می‌خواهد (مثلاً 'document') اینجا تغییر بده
    form.append('file', file, file.name);
    return this.http.post(`${this.baseUrl}/api/file_upload`, form);
  }

  /** حذف سند */
  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_pdf/${documentId}`);
  }

  /** آدرس مشاهده سند در تب جدید (بسته به بک‌اندت یکی از این‌ها) */
  getViewUrl(documentId: string): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/show_pdf/${documentId}`, {
    responseType: 'blob' // دریافت فایل به صورت باینری
  });
  }
  toggleTaxRelated(documentId: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/toggle_tax_related/${documentId}`, {});
}

}
    

