import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, DocumentMeta } from '../../../services/document/document.service';
import { DashboardModel } from '../../../models/dashboard-model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  documents: DocumentMeta[] = [];
  loading = false;
  uploading = false;
  errorMsg: string | null = null;

  constructor(private docService: DocumentService) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.loading = true;
    this.errorMsg = null;
    this.docService.listDocuments().subscribe({
      next: (docs:DashboardModel) => {
        this.documents = docs.documents;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error fetching documents list.';
        this.loading = false;
      }
    });
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.errorMsg = 'Only PDF files are allowed.';
      input.value = '';
      return;
    }

    this.uploading = true;
    this.errorMsg = null;

    this.docService.uploadDocument(file).subscribe({
      next: () => {
        this.uploading = false;
        input.value = '';
        this.fetchDocuments(); // پس از آپلود، لیست را تازه کن
      },
      error: (err) => {
        console.error(err);
        this.uploading = false;
        this.errorMsg = 'Error uploading document.';
      }
    });
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

  deleteDocument(documentId: string): void {
    const ok = confirm('Are you sure you want to delete this document?');
    if (!ok) return;

    this.docService.deleteDocument(documentId).subscribe({
      next: () => this.fetchDocuments(),
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error deleting document.';
      }
    });
  }

  trackByDocId(index: number, doc: DocumentMeta): string {
    return doc.document_id;
  }
}
