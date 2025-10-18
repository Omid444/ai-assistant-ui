import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'   // 👈 this makes the service available app-wide
})

export class AccountService {

    constructor(private http: HttpClient) { }
    private apiUrl = environment.apiUrl; // آدرس FastAPI backend


    getFirstname(): Observable <any> {
        return this.http.get<{ firstname: string }>(`${this.apiUrl}/account`)
    }
  toggleTaxRelated(documentId: string) {
  return this.http.post<{document_id: string, is_tax_related: boolean}>(`${this.apiUrl}/alerts/toggle_tax/${documentId}`, {});
}

closeDocument(documentId: string) {
  return this.http.post<{document_id: string, is_closed: boolean}>(`${this.apiUrl}/alerts/close/${documentId}`, {});
}
}

