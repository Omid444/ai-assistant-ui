import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../services/document/document.service';

import { environment } from '../../../../environments/environment';
export interface RetrievedDoc {
  file_name: string;
  due_date: string;      // تاریخ ISO
  document_id: string;
  content: string;       // page_content
  is_tax_related?: boolean;
  is_payment?: number;
  daysLeft?: number;     // محاسبه در فرانت
  priority?: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-account-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.css']
})
export class AccountHomeComponent implements OnInit {
  username: string | null = '';
  docs: RetrievedDoc[] = [];
  errorMsg: string | null = null;
  private baseUrl = environment.apiUrl;

  constructor(private accountService: AccountService, private docService: DocumentService) {
    // گرفتن username از توکن JWT
    const token = localStorage.getItem('auth_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.sub; // چون تو بک‌اند sub = username
    }
  }

  closeDocument(doc: RetrievedDoc): void {
  const ok = confirm(`Are you sure you want to close "${doc.file_name}"?`);
  if (!ok) return;
  this.accountService.closeDocument(doc.document_id).subscribe({
    next: () => {
      this.ngOnInit
      this.docs = this.docs.filter(d => d.document_id !== doc.document_id);
    },
    error: (err) => console.error(err)
  });
}


  openDocument_1(documentId: string): void {
    const url = `${this.baseUrl}/show_pdf/${documentId}`;
    window.open(url, '_blank');
  }

  openDocument(documentId: string): void {
    this.docService.getViewUrl(documentId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error opening document.';
      }
    });
  }
  ngOnInit() {

    this.accountService.getFirstname().subscribe({
      next: (res) => {
        if (res && res.firstname) {
          this.username = res.firstname;
        }

        if (res && res.retrieved_docs) {
          this.docs = res.retrieved_docs.map((doc: any) => {
            const dueDate = new Date(doc.due_date);
            const today = new Date();
            const diff = Math.ceil(
              (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            let priority: 'low' | 'medium' | 'high' = 'low';
            if (diff <= 7) priority = 'high';
            else if (diff <= 15) priority = 'medium';

            return {
              file_name: doc.file_name,
              due_date: doc.due_date,
              document_id: doc.document_id,
              is_tax_related: doc.is_tax_related,
              is_payment: doc.is_payment,
              content: doc.content,   // 👈 مستقیم از همون کلید جدید
              daysLeft: diff,
              priority
            } as RetrievedDoc;
          });
        }

      },
      error: (err) => {
        console.error('Error fetching account data:', err);
      }
    });
  }
  toggleTaxRelated(doc: RetrievedDoc): void {
  this.accountService.toggleTaxRelated(doc.document_id).subscribe({
    next: (res) => {
      doc.is_tax_related = res.is_tax_related;
    },
    error: (err) => console.error(err)
  });
}

}
