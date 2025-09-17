import { Component, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot/chatbot.service';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  chatbotOpen = false;
  messages: Message[] = [
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ];
  userInput = '';
  selectedFileName: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private chatbotService: ChatbotService) {}

  toggleChatbot(): void {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    // پیام کاربر
    this.messages.push({ sender: 'user', text: this.userInput });

    const userMessage = this.userInput;
    this.userInput = '';

    // TODO: ارسال به بک‌اند FastAPI
    
    // فراخوانی بک‌اند
    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (res) => {
        this.messages.push({
          sender: 'bot',
          text: res.reply
        });
      },
      error: (err) => {
        console.error(err);
        this.messages.push({
          sender: 'bot',
          text: 'Error connecting to server.'
        });
      }
    });
  }
  // 📎 مدیریت فایل
  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.messages.push({ sender: 'bot', text: 'Only PDF files are allowed.' });
      return;
    }

    this.selectedFileName = file.name;

    // TODO: اینجا می‌تونی فایل رو به سرور بفرستی
    // مثل: this.chatbotService.uploadFile(file).subscribe(...)
    this.chatbotService.uploadFile(file).subscribe({
    next: (res) => {
      this.messages.push({ sender: 'bot', text: res.reply || 'File uploaded successfully!' });
    },
    error: (err) => {
      console.error(err);
      this.messages.push({ sender: 'bot', text: 'Error uploading file.' });
    }
    });
  }

  // 🎤 دیکته (Web Speech API)
  startDictation(): void {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.userInput = transcript;
    };
  }
}
