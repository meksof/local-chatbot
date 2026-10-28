import { Component, inject, input } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-model-selector',
  imports: [],
  template: `
    <div class="flex items-center gap-2">
      <label class="text-caption-sm font-medium text-mute">Model</label>
      <select
        [value]="selectedModel()"
        (change)="onModelChange($event)"
        [disabled]="disabled()"
        class="px-3 py-1.5 h-8 border border-hairline rounded-full bg-canvas text-ink text-body-sm
               focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-ink
               disabled:bg-surface-soft disabled:text-mute disabled:cursor-not-allowed
               transition-colors"
      >
        @for (model of conversationService.models(); track model.name) {
          <option [value]="model.name">{{ model.name }}</option>
        }
      </select>
      @if (disabled()) {
        <span class="text-caption-sm text-mute">locked</span>
      }
    </div>
  `,
  styles: ``
})
export class ModelSelectorComponent {
  selectedModel = input<string>('');
  disabled = input<boolean>(false);

  conversationService = inject(ConversationService);

  onModelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.conversationService.setModel(select.value);
  }
}
