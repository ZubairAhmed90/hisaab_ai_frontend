# HisaabAI Web Dashboard — Cursor Instructions
# Stack: Next.js 14 (App Router) + Tailwind + shadcn/ui + Recharts
# Deployed: Vercel (free)

## Key Facts
- API base URL stored in: NEXT_PUBLIC_API_URL env variable
- All API calls go through: lib/api.ts (axios instance)
- Auth token stored in: localStorage as 'hisaab_token'
- Language preference stored in: localStorage as 'hisaab_lang' ('en' or 'ur')
- All amounts displayed as "Rs. X,XXX" format using formatPKR() utility

## Environment Variables (create .env.local in web/)
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"

## Folder Structure
web/
├── app/
│   ├── layout.tsx              ← root layout, sets font + providers
│   ├── page.tsx                ← landing/login redirect
│   ├── (auth)/
│   │   ├── login/page.tsx      ← login form
│   │   └── register/page.tsx   ← register form
│   └── (dashboard)/
│       ├── layout.tsx          ← sidebar + topbar wrapper
│       ├── dashboard/page.tsx  ← spending overview
│       ├── transactions/page.tsx ← transaction list + add + CSV import
│       ├── advisor/page.tsx    ← AI chat interface
│       ├── mirror/page.tsx     ← investment mirror
│       ├── budgets/page.tsx    ← budget management
│       ├── offers/page.tsx     ← personalized offers
│       └── reports/page.tsx    ← monthly report card
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         ← navigation sidebar
│   │   └── Topbar.tsx          ← header with balance + user menu
│   ├── dashboard/
│   │   ├── BalanceCard.tsx     ← total balance display
│   │   ├── SpendingDonut.tsx   ← category breakdown chart (Recharts)
│   │   ├── WeeklyChart.tsx     ← daily spending bar chart (Recharts)
│   │   └── BudgetBars.tsx      ← progress bars per category
│   ├── mirror/
│   │   └── MirrorCard.tsx      ← shows overspend vs investment return
│   ├── offers/
│   │   └── OfferCard.tsx       ← brand offer with redeem button
│   └── shared/
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── api.ts                  ← axios instance with auth interceptor
│   ├── utils.ts                ← formatPKR, formatDate, getCategoryEmoji
│   └── store.ts                ← zustand store for auth + user data
└── package.json

## All Pages — What Each Does

### /login
- Email + password form
- On success: save token to localStorage, redirect to /dashboard
- Show error if wrong credentials

### /register
- Name, email, password, phone, monthly income
- Language toggle (Urdu/English) 
- On success: auto-login, redirect to /dashboard

### /dashboard
- Fetch: GET /api/v1/transactions/summary (current month totals)
- Shows: Balance card, spending donut chart, budget progress bars, weekly chart
- Quick add transaction button (modal)

### /transactions
- Fetch: GET /api/v1/transactions (paginated list)
- Add button → modal with form
- Import CSV button → file upload → POST /api/v1/transactions/import-csv
- Each row shows: date, description, category emoji, amount (red=expense, green=income)

### /advisor
- Chat UI (like WhatsApp)
- Language toggle (Urdu/English)
- User types message → POST /api/v1/ai/chat
- Show AI response in bubble
- Daily tips shown at top: GET /api/v1/ai/tips

### /mirror
- Period tabs: 1 Month, 3 Months, 6 Months, 12 Months
- Each tab: fetch GET /api/v1/mirror?period=Xm
- Show: overspend amount + what it would be in each asset (stocks, gold, tbill)
- Line chart showing growth projection (Recharts)

### /budgets
- List of category budgets with edit/delete
- Add budget button → category + amount form
- Progress bars showing used vs limit

### /offers
- Grid of offer cards (brand logo, title, expiry, redeem button)
- Fetch: GET /api/v1/offers
- Redeem button → POST /api/v1/offers/:id/redeem → show promo code modal

### /reports
- Month picker dropdown
- Fetch: GET /api/v1/reports/monthly?month=YYYY-MM
- Show grade (big letter A-F), score breakdown, AI summary text

## Design System
- Primary color: #185FA5 (blue)
- Accent color: #1D9E75 (teal/green)
- Use shadcn/ui components for all UI elements
- Tailwind for spacing and layout
- No custom CSS unless absolutely needed
- Charts: Recharts only

## Code Rules
- MAX 80 lines per component file
- Split large components into smaller sub-components
- Use React Query (TanStack Query) for all API calls
- No useEffect for data fetching — use React Query hooks
- Loading states: show LoadingSpinner component
- Error states: show error message in red text
- Every page has a proper <title> tag

## API Call Pattern (in lib/api.ts)
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hisaab_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

## Utility Functions (in lib/utils.ts)
// Format amount as Pakistani Rupees
formatPKR(12500) → "Rs. 12,500"

// Get emoji for spending category
getCategoryEmoji('food') → '🍔'
getCategoryEmoji('transport') → '🚗'
getCategoryEmoji('shopping') → '🛍️'
getCategoryEmoji('utilities') → '💡'
getCategoryEmoji('health') → '💊'
getCategoryEmoji('entertainment') → '🎮'
getCategoryEmoji('education') → '📚'
getCategoryEmoji('religious') → '🤲'
getCategoryEmoji('transfer') → '💸'

## Category Colors (for charts)
food:          #EF4444 (red)
transport:     #F97316 (orange)
shopping:      #8B5CF6 (purple)
utilities:     #3B82F6 (blue)
health:        #EC4899 (pink)
entertainment: #F59E0B (amber)
education:     #10B981 (green)
religious:     #6366F1 (indigo)
transfer:      #6B7280 (gray)
other:         #9CA3AF (light gray)
