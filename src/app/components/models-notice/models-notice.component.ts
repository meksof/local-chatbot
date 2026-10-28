import { Component, input, computed, inject } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-models-notice',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-full text-center px-4">
      <!-- Icon -->
      <div class="mb-4 text-mute">
        @if (type() === 'loading') {
          <svg class="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        } @else {
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      </div>

      <!-- Notice card -->
      <div class="border border-hairline rounded-ds-lg p-8 bg-canvas max-w-sm w-full">
        <h2 class="font-display text-heading-sm text-ink mb-2">{{ title() }}</h2>
        <p class="text-body-sm text-body mb-4">{{ message() }}</p>

        @if (type() === 'not-installed') {
          <a
            href="https://ollama.com"
            target="_blank"
            class="text-body-sm text-ink underline mb-4 inline-block"
          >
            Learn how to install Ollama
          </a>
        }

        @if (showRetry()) {
          <div class="mt-2">
            <button
              (click)="retry()"
              class="px-5 py-2 bg-ink text-on-primary text-button-md rounded-full
                     hover:bg-ink-deep transition-colors"
            >
              Retry
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ModelsNoticeComponent {
  type = input.required<'not-installed' | 'no-models' | 'error' | 'loading'>();

  private conversationService = inject(ConversationService);

  title = computed(() => {
    switch (this.type()) {
      case 'not-installed': return 'Ollama Not Detected';
      case 'no-models':     return 'No Models Installed';
      case 'error':         return 'Resource Not Found';
      case 'loading':       return 'Loading Models';
    }
  });

  message = computed(() => {
    switch (this.type()) {
      case 'not-installed': return 'Ollama is not installed or not running. Please install Ollama and start it before continuing.';
      case 'no-models':     return 'Ollama is running but no models are installed. Run `ollama pull llama2` in your terminal to get started.';
      case 'error':         return 'Check if the endpoint is correct.';
      case 'loading':       return 'Checking for available models…';
    }
  });

  showRetry = computed(() => this.type() !== 'loading');

  retry(): void {
    this.conversationService.loadModels();
  }
}
