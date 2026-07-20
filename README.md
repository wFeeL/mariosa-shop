# Mariosa Jewelry storefront

Standalone responsive website for the private Mariosa Jewelry demo. It is not a Telegram Mini App and does not load the Telegram WebApp SDK.

## Run

```bash
npm install
npm run dev
```

The development server uses `http://127.0.0.1:5217`.

## Order handoff

The site does not pretend to accept payment or send an order automatically. It builds a deterministic request, copies it to the clipboard and opens Marina's Telegram contact so the visitor can paste and send it.

## Publication note

The project is marked `noindex`. Before public deployment, confirm permission to publish the supplied model photography and clarify delivery, payment, production time and returns copy.
