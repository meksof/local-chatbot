import { Component, inject } from '@angular/core';
import { ConversationService } from './services/conversation.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatComponent } from './components/chat/chat.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatComponent, BottomNavComponent, ToastComponent],
  template: `
    <div class="flex h-screen bg-canvas">
      <!-- Desktop sidebar — always visible ≥md -->
      <aside class="hidden md:block w-64 border-r border-hairline shrink-0">
        <app-sidebar />
      </aside>

      <!-- Mobile sidebar — overlay drawer, <md only -->
      @if (conversationService.mobileView() === 'sidebar') {
        <aside
          class="fixed inset-0 z-40 bg-black/40 md:hidden"
          (click)="closeSidebar()"
        >
          <div
            class="w-72 h-full"
            (click)="$event.stopPropagation()"
          >
            <app-sidebar />
          </div>
        </aside>
      }

      <!-- Main content area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto pb-14 md:pb-0">
          <app-chat />
        </div>
      </main>

      <!-- Mobile bottom navigation -->
      <app-bottom-nav />
    </div>

    <!-- Toast notification overlay -->
    <app-toast />
  `,
  styles: ``
})
export class App {
  conversationService = inject(ConversationService);

  closeSidebar(): void {
    this.conversationService.setMobileView('chat');
  }
}
