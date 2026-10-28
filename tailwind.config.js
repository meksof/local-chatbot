/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // ─── Design System: Colors ───────────────────────────────────────────
      colors: {
        // Brand & Action
        primary:          '#000000',
        'ink':            '#000000',
        'ink-deep':       '#090909',
        // Text
        charcoal:         '#525252',
        body:             '#737373',
        mute:             '#a3a3a3',
        // Surfaces
        canvas:           '#ffffff',
        'surface-soft':   '#fafafa',
        'surface-card':   '#ffffff',
        'surface-dark':   '#171717',
        // Borders
        hairline:         '#e5e5e5',
        'hairline-strong':'#d4d4d4',
        // On-dark text
        'on-primary':     '#ffffff',
        'on-dark':        '#ffffff',
        'on-dark-mute':   'rgba(255,255,255,0.7)',
        // Links
        link:             '#000000',
        'link-mute':      '#737373',
        // Focus
        'focus-ring':     'rgba(59,130,246,0.5)',
        // Terminal traffic lights
        'terminal-red':   '#ff5f56',
        'terminal-yellow':'#ffbd2e',
        'terminal-green': '#27c93f',
      },

      // ─── Design System: Border Radius ────────────────────────────────────
      borderRadius: {
        // Map design tokens on top of Tailwind defaults
        'ds-sm':  '6px',
        'ds-md':  '8px',
        'ds-lg':  '12px',
      },

      // ─── Design System: Spacing ──────────────────────────────────────────
      spacing: {
        'xxs':     '2px',
        'xs':      '4px',
        // sm/md/lg/xl are already 8/12/16/24 in Tailwind — keep design tokens as aliases
        'ds-sm':   '8px',
        'ds-md':   '12px',
        'ds-lg':   '16px',
        'ds-xl':   '24px',
        'xxl':     '32px',
        'section': '88px',
      },

      // ─── Design System: Font Families ────────────────────────────────────
      fontFamily: {
        // Display / heading face — Nunito (open-source), SF Pro Rounded (Apple), system-ui fallback
        display: ['Nunito', 'SF Pro Rounded', 'system-ui', '-apple-system', 'sans-serif'],
        // Body face — OS default sans
        sans:    ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        // Code face — OS default mono
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      // ─── Design System: Font Sizes (typography scale) ────────────────────
      fontSize: {
        'display-xl': ['36px', { lineHeight: '1.11', fontWeight: '500' }],
        'display-lg': ['30px', { lineHeight: '1.2',  fontWeight: '500' }],
        'heading-lg': ['24px', { lineHeight: '1.33', fontWeight: '600' }],
        'heading-md': ['20px', { lineHeight: '1.4',  fontWeight: '500' }],
        'heading-sm': ['18px', { lineHeight: '1.56', fontWeight: '500' }],
        'body-md':    ['16px', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-strong':['16px', { lineHeight: '1.5',  fontWeight: '500' }],
        'body-sm':    ['14px', { lineHeight: '1.43', fontWeight: '400' }],
        'body-sm-strong':['14px', { lineHeight: '1.43', fontWeight: '500' }],
        'caption-sm': ['12px', { lineHeight: '1.33', fontWeight: '400' }],
        'code-md':    ['16px', { lineHeight: '1.5',  fontWeight: '400' }],
        'code-sm':    ['14px', { lineHeight: '1.43', fontWeight: '400' }],
        'button-md':  ['14px', { lineHeight: '1',    fontWeight: '500' }],
      },
    },
  },
  plugins: [],
}
