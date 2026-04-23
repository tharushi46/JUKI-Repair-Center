## jukirepair (React + Firebase)

Modern, responsive product showcase + admin CRUD for a Juki sewing machine repair & sales business.

### Features

- **Customer UI**: product grid, search by name, availability badge, details page with Call/WhatsApp buttons
- **Admin (hidden)**: `/admin` login → dashboard to add/edit/delete products + image upload
- **Backend**: Firebase Firestore (products) + Firebase Storage (images), real-time updates
- **UX**: responsive Tailwind design, smooth transitions, loading spinners, image optimization before upload

### Setup

1) Install dependencies

```bash
cd jukirepair
npm install
```

2) Create a Firebase project

 - Enable **Firestore** and create a collection named **`products`**
 - Enable **Storage** for product images

3) Configure environment variables

Copy `.env.example` → `.env` and fill in your Firebase web app config values.

4) Run locally

```bash
npm run dev
```

### Admin credentials

- **Username**: `adminjuki` (or a mobile number format)
- **Password**: `jukiadmin631`

### Business contact number

Update `src/config/business.ts` to your real phone/WhatsApp number.
