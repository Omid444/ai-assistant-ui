import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  chatbotOpen = false;
  messages: Message[] = [
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ];
  userInput = '';

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
    // الان موقتاً یک پاسخ فیک اضافه می‌کنیم
    setTimeout(() => {
      this.messages.push({
        sender: 'bot',
        text: `You said: "${userMessage}"`
      });
    }, 500);
  }
}
