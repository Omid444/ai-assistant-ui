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
}