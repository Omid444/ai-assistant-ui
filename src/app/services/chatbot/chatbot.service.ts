import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ChatResponse {
  reply: string;
}

export interface ChatHistoryItem {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  title: string;
}


@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/api/chat`, { message });
  }
  /** 📎 آپلود فایل PDF برای Chatbot */
  uploadFile(file: File): Observable<ChatResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ChatResponse>(`${this.baseUrl}/api/file_upload`, formData);
  }
  getHistory(): Observable<ChatHistoryItem[]> {
    return this.http.get<ChatHistoryItem[]>(`${this.baseUrl}/api/chat/history`);
  }
}
