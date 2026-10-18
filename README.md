# Flutterfly Travels

A travel agency web app built as the CSE 216 (Database) term project at BUET. Customers browse destinations, accommodations, restaurants and flights in Bangladesh, plan trips with a travel agent, and book items into those trips. Agents build the trips, and an admin approves new agents and confirmed trips.

- **Database:** PostgreSQL, with business logic in PL/pgSQL functions, a procedure and triggers
- **Backend:** Node.js and Express (`Backend/`)
- **Frontend:** React and Vite (`Frontend/`)

## Project structure

```
Backend/
  index.js            Express app (port from .env, default 3000)
  auth.js             JWT login checks (requireAuth, roles, trip ownership)
  database.js         Postgres connection pool (query, transaction)
  realtime.js         Pushes new notifications to users instantly (socket.io + Postgres LISTEN)
  router/             API routes, one file per resource
  database/
    schema.sql        Tables, constraints, functions, procedure and triggers
    seed.sql          Sample data (locations, airports, flights, destinations, ...), no user accounts
  create-admin.js     Creates an admin account (npm run create-admin)
  file_handling.js    Profile photo upload and removal (Supabase Storage)
Frontend/
  src/api.js          apiFetch: fetch wrapper that sends the login token
  src/Pages/, src/Components/
ERD.pdf               Entity-relationship diagram
IMAGE_CREDITS.md      Authors and licences of the Wikimedia Commons photos
```

## Setup

You need Node.js 20 or newer and PostgreSQL 16 or newer. `schema.sql` was dumped by `pg_dump` 18, and its `\restrict` lines need a recent `psql`.

### 1. Create the database

```bash
sudo -u postgres createdb flutterfly_travels
sudo -u postgres psql -d flutterfly_travels -f Backend/database/schema.sql
sudo -u postgres psql -d flutterfly_travels -f Backend/database/seed.sql
```

### 2. Configure the backend

```bash
cp Backend/.env.example Backend/.env
```

Fill in `Backend/.env`:

- `DB_PASSWORD`: the password of the `postgres` role. If it has none yet, set one with `sudo -u postgres psql -c "\password postgres"`.
- `JWT_SECRET`: a long random string. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: from the Supabase dashboard, under Project Settings > API. The backend needs them to upload profile photos. The service role key bypasses all access rules, so it belongs only in this file, never in the frontend.

Never commit `Backend/.env`; it is git-ignored.

### 3. Install and run

Use two terminals:

```bash
cd Backend && npm install && npm start      # API on http://localhost:3000
cd Frontend && npm install && npm run dev   # App on http://localhost:5000
```

## Accounts

The seed data contains no user accounts.

- **Customers and agents:** sign up in the app. A new agent stays pending, and customers can't pick them for trips, until an admin approves them.
- **Admins:** signup can't create admins. Create one from the command line after setting up the database:

```bash
cd Backend
npm run create-admin
```

The script asks for a username, email, name and password. It stores the password as a bcrypt hash.

## How it works

### Trip lifecycle

`REQUESTING` → `UPDATING` → `PENDING` → `CONFIRMED` → `COMPLETED`

1. A customer creates a trip and requests an agent (`REQUESTING`).
2. The agent accepts and adds bookings (`UPDATING`).
3. The trip is sent to the admin (`PENDING`), who confirms it (`CONFIRMED`).
4. It becomes `COMPLETED` once its return date has passed.

### Database logic

- **Functions:** `check_username` and `check_trip_name` check availability. `get_booking_id` creates a booking and returns its id.
- **Procedure:** `fetch_filtered_flights` returns a cursor of flights between two airports for a seat class.
- **Triggers:**
  - keep each trip's total cost up to date as bookings are added
  - keep each destination's, accommodation's, restaurant's and agent's rating equal to the average of its customers' ratings (0 = not rated yet)
  - count each customer's completed trips and issue discount coupons
  - delete the ratings and reviews of deleted items
  - send notifications for trip, booking, wishlist and agent-approval events

### Real-time notifications

Notifications reach the user instantly, without polling:

1. The `notification_created` trigger calls `pg_notify('notification_created', <id>)` for every new row in `notification`. Postgres delivers this message only when the transaction commits.
2. The backend (`Backend/realtime.js`) keeps one connection doing `LISTEN notification_created`. It looks up the row and sends it over socket.io to that user's open tabs.
3. Socket connections log in with the same JWT, and each user only receives their own notifications. On every (re)connect the app reloads the list, so nothing is missed while it's offline.

### Images

The homepage slider photos ship with the frontend, in `Frontend/public/homepage/`. All other images are served from public buckets in Supabase Storage, so the app doesn't depend on other websites' links:

| Bucket | Contents | Referenced from |
|---|---|---|
| `destinations`, `accomodations`, `restaurants` | `<id>-<name>/image.jpg`, `image1` to `image3` | the item's `image*` columns |
| `flights` | one photo per airline | `flight.image` |
| `users` | profile photos, uploaded by the backend | `users.photo` (full URL) |

The photos that replaced broken links come from Wikimedia Commons. Their authors and licences are in [IMAGE_CREDITS.md](IMAGE_CREDITS.md).

### Authentication

Logging in (`POST /user/login`) returns a JWT that is valid for `JWT_EXPIRES_IN` (default 1 day). The frontend sends it as `Authorization: Bearer <token>` on every request. The backend enforces four levels of access:

- **Public:** browsing.
- **Logged-in users:** booking, trips, wishlists and reviews.
- **Trip participants only:** a trip can be changed only by its customer, its agent or an admin.
- **Admins only:** agent approval and trip confirmation.
