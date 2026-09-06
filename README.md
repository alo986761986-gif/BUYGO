# BUYGO

Marketplace reale, inizialmente vuoto: nessun prodotto, utente, ordine, recensione o venditore demo viene creato automaticamente.

## Avvio
1. Copia `.env.example` in `.env.local` e configura `DATABASE_URL` e `AUTH_SECRET`.
2. `npm install`
3. `npm run db:init`
4. `npm run dev`

## Ruoli
La registrazione pubblica crea CUSTOMER. La promozione a SELLER/ADMIN va fatta da un amministratore/database fino a quando non viene collegato un flusso KYC/approvazione.

## Pagamenti
Checkout Stripe è predisposto ma richiede `STRIPE_SECRET_KEY`. Per un vero marketplace multi-venditore va completato Stripe Connect (KYC, connected accounts, application fee, payouts e webhook).

## Nessun dato demo
`db/schema.sql` crea solo tabelle e tipi. Non contiene seed.
