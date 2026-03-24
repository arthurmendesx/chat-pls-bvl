# Design System — ChatSupport

> **Mandatory context** for every UI prompt. All components must follow these tokens and patterns.

---

## 1. Color Palette

| Token                | Tailwind Class          | Hex         | Usage                                       |
|----------------------|-------------------------|-------------|---------------------------------------------|
| `brand-primary`      | `blue-600`              | `#2563eb`   | Primary buttons, active states, links        |
| `brand-primary-dark` | `blue-700`              | `#1d4ed8`   | Hover states for primary elements            |
| `brand-primary-light`| `blue-50`               | `#eff6ff`   | Subtle primary backgrounds                   |
| `brand-accent`       | `orange-500`            | `#f97316`   | Notifications, highlights, secondary buttons |
| `bg-app`             | `slate-50`              | `#f8fafc`   | Main application background                  |
| `bg-sidebar`         | `white`                 | `#ffffff`   | Sidebar background                           |
| `bg-chat`            | `slate-50`              | `#f8fafc`   | Chat area background                         |
| `bg-panel`           | `white`                 | `#ffffff`   | Right panel background                       |
| `bg-bubble-bot`      | `blue-600`              | `#2563eb`   | Bot/Agent message bubble background          |
| `bg-bubble-user`     | `white`                 | `#ffffff`   | User/customer message bubble background      |
| `bg-input`           | `white`                 | `#ffffff`   | Input fields background                      |
| `text-primary`       | `gray-900`              | `#111827`   | Headings, contact names                      |
| `text-secondary`     | `gray-600`              | `#4b5563`   | Body text, phone numbers                     |
| `text-muted`         | `gray-400`              | `#9ca3af`   | Timestamps, placeholders                     |
| `text-on-dark`       | `white`                 | `#ffffff`   | Text on dark bubbles / primary buttons       |
| `border-default`     | `gray-200`              | `#e5e7eb`   | Dividers, input borders, panel borders       |
| `status-online`      | `green-500`             | `#22c55e`   | Online indicator dots                        |
| `status-waiting`     | `orange-500`            | `#f97316`   | Waiting / attention indicator                |
| `status-error`       | `red-500`               | `#ef4444`   | End session, destructive actions             |

---

## 2. Typography

**Font Family:** `Inter` (loaded from Google Fonts) — fallback `sans-serif`.

| Role               | Class                              | Size   | Weight       |
|--------------------|------------------------------------|--------|--------------|
| App title / Logo   | `text-lg font-bold`                | 18px   | 700          |
| Section heading    | `text-base font-semibold`          | 16px   | 600          |
| Contact name       | `text-sm font-semibold`            | 14px   | 600          |
| Body / message     | `text-sm font-normal`              | 14px   | 400          |
| Caption / phone    | `text-xs font-normal`              | 12px   | 400          |
| Timestamp          | `text-xs font-normal text-muted`   | 12px   | 400          |
| Button label       | `text-sm font-medium`              | 14px   | 500          |
| Filter pill        | `text-xs font-medium`              | 12px   | 500          |

---

## 3. Spacing, Radii & Shadows

### Spacing Scale (most used)

| Token  | Tailwind | Pixels | Usage                        |
|--------|----------|--------|------------------------------|
| xs     | `p-1`    | 4px    | Inline icon padding          |
| sm     | `p-2`    | 8px    | Filter pill padding          |
| md     | `p-3`    | 12px   | Input padding, card padding  |
| lg     | `p-4`    | 16px   | Section padding              |
| xl     | `p-6`    | 24px   | Panel padding                |

### Border Radius

| Elements              | Class           |
|-----------------------|-----------------|
| Buttons               | `rounded-lg` or `rounded-full` |
| Chat bubbles          | `rounded-2xl`   |
| Input fields          | `rounded-full`  |
| Avatars               | `rounded-full`  |
| Filter pills          | `rounded-full`  |
| Cards / Panels        | `rounded-lg`    |

### Box Shadows

| Element          | Class              |
|------------------|--------------------|
| Sidebar          | `shadow-sm`        |
| Floating panels  | `shadow-md`        |
| Buttons (hover)  | `shadow-sm`        |

---

## 4. Component Patterns

### 4.1 Filter Pills

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   All    │  │   Bot    │  │ Waiting  │  │   Mine   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

- **Active:** `bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-medium`
- **Inactive:** `bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-medium hover:bg-gray-200`

### 4.2 Contact List Item

```
┌─────────────────────────────────────────┐
│  [AV]  Name                             │
│   ●    +1 (555) 123-4567                │
│        Last message preview...          │
└─────────────────────────────────────────┘
```

- Container: `flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-gray-100`
- Active/selected: `bg-blue-50 border-l-3 border-l-blue-600`
- Avatar: `w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-semibold`
- Online dot: `absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white`

### 4.3 Chat Bubble — Bot

```
                          ┌──────────────────────────────────┐
                          │ 🤖 Bot                           │
                          │ Hello! I'd be happy to help...   │
                          └──────────────────────────────────┘
                                                     10:23 AM
```

- Container: `flex justify-end`
- Bubble: `bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-3 max-w-lg`
- Label: `text-xs font-medium text-blue-100 flex items-center gap-1 mb-1`
- Timestamp: `text-xs text-blue-200 text-right mt-1`

### 4.4 Chat Bubble — User (Customer)

```
┌──────────────────────────┐
│ Hi, I need help with...  │
└──────────────────────────┘
10:23 AM
```

- Container: `flex justify-start`
- Bubble: `bg-white shadow-sm text-gray-900 rounded-2xl rounded-bl-none px-4 py-3 max-w-lg`
- Timestamp: `text-xs text-gray-400 mt-1`

### 4.5 Action Buttons (Right Panel)

| Button           | Style                                                                                   |
|------------------|-----------------------------------------------------------------------------------------|
| Take over chat   | `bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all text-white rounded-full px-4 py-2.5 w-full font-medium` |
| Return to Bot    | `border border-gray-300 text-gray-700 rounded-full px-4 py-2.5 w-full font-medium hover:bg-slate-50 transition-all` |
| End Session      | `border border-gray-300 text-red-500 rounded-full px-4 py-2.5 w-full font-medium hover:bg-red-50 transition-all` |

### 4.6 Message Input Bar

```
┌───┬─────────────────────────────────┬──────────┐
│ 📎│  Type your message...           │  ✈ Send  │
└───┴─────────────────────────────────┴──────────┘
```

- Container: `flex items-center gap-2 p-4 border-t border-gray-200 bg-white`
- Input: `flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600`
- Send button: `bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all text-white rounded-full px-4 py-2.5 flex items-center gap-1 text-sm font-medium`
