## What I'll build

A campus pre-order + digital queue platform layered into the existing desktop website. Existing mobile-frame routes (/, /cart, /item, etc.) and the current theme/typography stay untouched. New work lives in new desktop routes plus the already-Zomato-styled `/home`.

## Phase 1 — Cloud + data

Enable Lovable Cloud (Supabase) so the mock can be promoted to real backend later. For this build, all interactive state stays in **localStorage** (per your "fully mocked" intent) — the schema doc lives in code comments so wiring is a one-step swap.

Vendors (campus-themed dummy data):
- Canteens: Hall 1 Canteen … Hall 14 Canteen, Mama Mio
- Barbers: Hall 2 Barber, Old Shop Barber, Main Gate Barber

## Phase 2 — Auth + RBAC (mock)

- `/auth` — sign in / sign up, role selector (User by default)
- Roles stored in localStorage: `user` | `merchant_pending` | `merchant` | `admin`
- Seeded admin account: `admin@campus / admin`
- `useAuth()` hook + `RoleGate` wrapper

## Phase 3 — Navigation

Update top nav (in `/home` and new desktop pages):
- Tabs: **Canteens**, **Barbers** (remove Delivery / Nightlife)
- Right side: conditional links — Admin Panel (admin), Merchant Dashboard (approved merchant), Apply as Merchant (user)
- **Active Ticket Widget** — floating bottom-right pill showing token + ETA when an order is active, links to `/track`

## Phase 4 — Discovery (User)

Update `/home`:
- Collections: "Must-Try This Week", "Quickest Queues", "Hidden Gems"
- Filters: "Shortest Wait", "Open Now", "High Rewards", "Quick Prep"
- Vendor cards show **Live Queue** badge ("4 in queue · ~15 min") instead of delivery info
- Infinite scroll feed (IntersectionObserver)
- Separate `/barbers` page same pattern

## Phase 5 — Vendor detail + cart

- Vendor detail header: avg prep time + live queue status
- Add-to-cart modal with custom instructions ("Make it spicy")
- Cart adds: **Schedule** toggle (Now / +30 min / +1 hr)
- **Dummy checkout** `/checkout`: Campus Card + UPI Scan & Pay (dummy QR). "Pay Now" → instant success
- "Cancel before accepted" button on tracker

## Phase 6 — Live Tracker (Domino's-style)

New route `/track`:
- 4-step horizontal progress: Pending → Accepted → Preparing → Ready
- **60-second acceptance countdown** on Pending step
- Massive token number / queue position
- Live ETA countdown
- Auto-advances via setInterval (simulated). Links to merchant's incoming-order view

## Phase 7 — Merchant Dashboard

`/merchant` (gated to approved merchants):
- Incoming orders list with 1-min acceptance timer per order (Accept / Reject)
- Live queue time editor
- Menu manager (add/edit/remove items — localStorage)
- Pending-approval state for `merchant_pending`

## Phase 8 — Admin Dashboard

`/admin` (gated):
- Merchant applications table → Approve / Reject buttons that flip role to `merchant`

## Phase 9 — Notifications + Rewards

- Sonner toasts simulating real-time updates ("Ready in 5 min — start walking!", "1 person ahead of you")
- Profile additions: **Rewards Wallet** tab — Campus Coins balance, transaction history, gamification badges

## Technical notes

- All new code is JavaScript-friendly React (`.tsx` files kept since project is TS; logic plain JS). No theme/CSS/typography changes — reuse `zinc-900 / surface / amber` palette.
- Routes added under `src/routes/`: `auth.tsx` (already exists, extended), `canteens.tsx`, `barbers.tsx`, `checkout.tsx`, `track.tsx`, `merchant.tsx`, `merchant.apply.tsx`, `admin.tsx`, `vendor.$id.tsx`, plus updates to `home.tsx`, `profile.tsx`.
- Shared components: `TopNav.tsx`, `ActiveTicketWidget.tsx`, `LiveTracker.tsx`, `VendorCard.tsx`, `RoleGate.tsx`, `useAuth.ts`, `useCart.ts`, `useOrders.ts`, `lib/campus-data.ts`.
- Existing mobile-frame routes untouched.

## Deliverable

A fully clickable mocked platform: sign up as user → browse canteens → add to cart → schedule + pay → track order with 60s countdown → sign up as merchant → admin approves → merchant accepts order → user sees status update + earns Campus Coins. Wiring it to real Supabase later is mostly swapping the localStorage hooks for server-fn calls.