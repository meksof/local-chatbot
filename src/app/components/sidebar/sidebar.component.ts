import { Component, inject } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { APP_VERSION } from '../../app-version.token';

@Component({
  selector: 'app-sidebar',
  imports: [],
  template: `
    <div class="flex flex-col h-full bg-surface-dark text-on-dark">
      <!-- Header: New Chat CTA -->
      <div class="p-4 border-b border-white/10">
        <button
          (click)="newConversation()"
          [disabled]="conversationService.modelsStatus() !== 'loaded'"
          class="w-full py-2 px-5 bg-canvas text-ink text-button-md font-medium rounded-full
                 hover:bg-surface-soft transition-colors
                 disabled:bg-white/10 disabled:text-on-dark-mute disabled:cursor-not-allowed"
        >
          + New Chat
        </button>
      </div>

      <!-- Conversation list -->
      <div class="flex-1 overflow-y-auto">
        @for (conv of conversationService.conversations(); track conv.id) {
          <div
            class="group px-3 py-3 border-b border-white/10 cursor-pointer transition-colors
                   hover:bg-white/5"
            [class.bg-white/10]="conversationService.activeConversation()?.id === conv.id"
            (click)="selectConversation(conv.id)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-body-sm-strong font-medium truncate flex-1 text-on-dark">
                {{ conv.title }}
              </span>
              <button
                class="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-full
                       text-on-dark-mute hover:text-on-dark transition-opacity"
                (click)="deleteConversation($event, conv.id)"
                aria-label="Delete conversation"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="text-caption-sm text-on-dark-mute mt-1 truncate">{{ conv.model }}</div>
          </div>
        }

        @if (conversationService.conversations().length === 0) {
          <div class="p-4 text-on-dark-mute text-caption-sm text-center">
            No conversations yet
          </div>
        }
      </div>

      <!-- Footer: app version -->
      <div class="p-4 border-t border-white/10 text-caption-sm text-on-dark-mute text-center">
        v{{ version }}
      </div>
    </div>
  `,
  styles: ``
})
export class SidebarComponent {
  conversationService = inject(ConversationService);
  version = inject(APP_VERSION);

  newConversation(): void {
    const models = this.conversationService.models();
    const defaultModel = models.length > 0 ? models[0].name : 'llama2';
    this.conversationService.createConversation(defaultModel);
  }

  selectConversation(id: string): void {
    this.conversationService.selectConversation(id);
  }

  deleteConversation(event: Event, id: string): void {
    event.stopPropagation();
    this.conversationService.deleteConversation(id);
  }
}
