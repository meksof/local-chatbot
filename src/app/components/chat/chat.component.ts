import { Component, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ModelSelectorComponent } from '../model-selector/model-selector.component';
import { ModelsNoticeComponent } from '../models-notice/models-notice.component';

@Component({
  selector: 'app-chat',
  imports: [MessageInputComponent, ModelSelectorComponent, ModelsNoticeComponent],
  template: `
    <div class="flex flex-col h-full">
      <!-- Header bar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-hairline bg-canvas">
        <h1 class="font-display text-heading-sm text-ink">Local Chatbot</h1>
      </div>

      <!-- Main chat area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-canvas" #chatContainer>
        @if (conversationService.modelsStatus() === 'not-installed') {
          <app-models-notice type="not-installed" />
        } @else if (conversationService.modelsStatus() === 'no-models') {
          <app-models-notice type="no-models" />
        } @else if (conversationService.modelsStatus() === 'error') {
          <app-models-notice type="error" />
        } @else if (conversationService.modelsStatus() === 'loading') {
          <app-models-notice type="loading" />
        } @else if (conversationService.activeConversation()) {
          @if (conversationService.activeConversation()!.messages.length === 0) {
            <!-- Empty state: active conversation, no messages -->
            <div class="flex flex-col items-center justify-center h-full text-center px-4">
              <div class="mb-4 text-mute">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 class="font-display text-heading-sm text-ink mb-2">Start a conversation</h2>
              <p class="text-body-sm text-body max-w-sm">
                Select a model below and send your first message to begin chatting with the AI.
              </p>
            </div>
          } @else {
            <!-- Message thread -->
            @for (message of conversationService.activeConversation()!.messages; track message.id) {
              <div
                class="flex"
                [class.justify-end]="message.role === 'user'"
                [class.justify-start]="message.role === 'assistant'"
              >
                <div
                  class="max-w-[80%] px-4 py-2"
                  [class.bg-ink]="message.role === 'user'"
                  [class.text-on-primary]="message.role === 'user'"
                  [class.rounded-full]="message.role === 'user'"
                  [class.bg-surface-soft]="message.role === 'assistant'"
                  [class.text-ink]="message.role === 'assistant'"
                  [class.rounded-ds-lg]="message.role === 'assistant'"
                >
                  <p class="text-body-sm whitespace-pre-wrap">{{ message.content }}</p>
                </div>
              </div>
            }
          }

          <!-- Typing indicator -->
          @if (conversationService.isLoading()) {
            <div id="spinner" class="flex justify-start">
              <div class="bg-surface-soft border border-hairline rounded-ds-lg px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-mute rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-mute rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-mute rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          }
        } @else {
          <!-- Empty state: no active conversation -->
          <div class="flex flex-col items-center justify-center h-full text-center px-4">
            <div class="mb-4 text-mute">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 class="font-display text-heading-sm text-ink mb-2">Welcome to Local Chatbot</h2>
            <p class="text-body-sm text-body max-w-sm mb-6">
              Create a new conversation to start chatting with local AI models via Ollama.
            </p>
            <button
              (click)="createConversation()"
              class="px-5 py-2 bg-ink text-on-primary text-button-md rounded-full
                     hover:bg-ink-deep transition-colors"
            >
              Start New Chat
            </button>
          </div>
        }
      </div>

      <!-- Input bar footer -->
      @if (conversationService.activeConversation()) {
        <div class="px-4 py-3 border-t border-hairline bg-canvas">
          <app-model-selector
            [selectedModel]="conversationService.activeConversation()!.model"
            [disabled]="conversationService.activeConversation()!.messages.length > 0"
          />
          <app-message-input />
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  conversationService = inject(ConversationService);

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  createConversation(): void {
    const models = this.conversationService.models();
    const defaultModel = models.length > 0 ? models[0].name : 'llama2';
    this.conversationService.createConversation(defaultModel);
  }
}
