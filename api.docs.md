## Movie Booking App - REST API (v1)

Base path used throughout this document:

```
/mba/api/v1
```

### Conventions

#### Authentication

- Token-based auth via JWT (or similar).
- For protected endpoints, send:

```
Authorization: Bearer <access_token>
```

#### Roles

- `ROOT_ADMIN` (seeded in DB; no API endpoint to create)
- `SYSTEM_ADMIN`
- `CLIENT` (must be approved by admin before performing client actions)
- `CUSTOMER`

#### Common status codes

- `200` OK
- `201` Created
- `400` Validation error
- `401` Unauthenticated
- `403` Unauthorized
- `404` Not found
- `409` Conflict

---

## Authentication & Authorization

### Sign up (customer)

```
POST : /mba/api/v1/auth/signup
```

Request body (example):

```json
{
    "name": "Alex",
    "email": "alex@example.com",
    "password": "StrongPassword@123"
}
```

Response (example):

```json
{
    "user": {
        "id": "<userId>",
        "name": "Alex",
        "email": "alex@example.com",
        "role": "CUSTOMER"
    }
}
```

### Sign up (client registration - requires approval)

```
POST : /mba/api/v1/auth/clients/signup
```

Request body (example):

```json
{
    "ownerName": "Sam",
    "companyName": "Sam Cinemas Pvt Ltd",
    "email": "sam@samcinemas.com",
    "password": "StrongPassword@123",
    "phone": "+1-555-123-4567"
}
```

Notes:

- Created client defaults to `status=PENDING`.
- Until approved, client cannot create/update theatres.

### Login

```
POST : /mba/api/v1/auth/login
```

Request body (example):

```json
{
    "email": "alex@example.com",
    "password": "StrongPassword@123"
}
```

Response (example):

```json
{
    "accessToken": "<jwt>",
    "expiresIn": 3600,
    "user": {
        "id": "<userId>",
        "email": "alex@example.com",
        "role": "CUSTOMER"
    }
}
```

### Get my profile (who am I?)

```
GET : /mba/api/v1/auth/me
```

Auth: Required

### Logout (optional)

If you implement server-side token invalidation/blacklisting:

```
POST : /mba/api/v1/auth/logout
```

Auth: Required

---

## Users

### Get a user (admin only)

```
GET : /mba/api/v1/users/:id
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

### List users (admin only)

```
GET : /mba/api/v1/users
```

Query params (optional):

- `role=CLIENT|CUSTOMER|SYSTEM_ADMIN`
- `status=PENDING|APPROVED|REJECTED` (for clients)
- `email=...`

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

---

## Client approval (admin)

### Approve a client

```
PATCH : /mba/api/v1/admin/clients/:clientId/approve
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

### Reject a client

```
PATCH : /mba/api/v1/admin/clients/:clientId/reject
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

Body (optional example):

```json
{ "reason": "KYC not complete" }
```

---

## REST API for Movies

### Create a movie

```
POST : /mba/api/v1/movies
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

Request body (example):

```json
{
    "name": "Interstellar",
    "description": "Sci-fi epic",
    "durationMins": 169,
    "language": "EN",
    "genres": ["Sci-Fi", "Drama"],
    "releaseDate": "2014-11-07"
}
```

### List all movies

```
GET : /mba/api/v1/movies
```

Query params (optional):

- `name=xyz` (partial match)
- `language=EN`
- `genre=Sci-Fi`
- `sort=releaseDate|name`
- `page=1&limit=20`

### Get a particular movie

```
GET : /mba/api/v1/movies/:id
```

### Delete a movie

```
DELETE : /mba/api/v1/movies/:id
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

### Update a movie

```
PUT : /mba/api/v1/movies/:id
```

Auth: Required (`SYSTEM_ADMIN` / `ROOT_ADMIN`)

---

## Theatres / Halls

Terminology:

- A **theatre/hall** is a venue (client-owned).
- A theatre can run multiple movies.

### Create a theatre (client)

```
POST : /mba/api/v1/theatres
```

Auth: Required (`CLIENT`) + must be `APPROVED`

Request body (example):

```json
{
    "name": "Sam Cinemas - Downtown",
    "city": "San Jose",
    "pin": "95112",
    "address": "123 Market St",
    "screens": 3,
    "seatMap": {
        "screen1": { "rows": 10, "cols": 12 }
    }
}
```

### Update a theatre (client owner)

```
PUT : /mba/api/v1/theatres/:id
```

Auth: Required (`CLIENT`, owner) or (`SYSTEM_ADMIN`/`ROOT_ADMIN`)

### Delete a theatre (client owner)

```
DELETE : /mba/api/v1/theatres/:id
```

Auth: Required (`CLIENT`, owner) or (`SYSTEM_ADMIN`/`ROOT_ADMIN`)

### Get theatre details

```
GET : /mba/api/v1/theatres/:id
```

Public: Yes

### List theatres (with filters)

```
GET : /mba/api/v1/theatres
```

Query params (optional):

- `city=San%20Jose`
- `pin=95112`
- `movieId=<movieId>` (theatres where a movie is running)
- `page=1&limit=20`

Public: Yes

---

## Movies running in theatres (mapping)

Depending on your data model you can store this as:

- `theatre.movies[]` (movieId + show info), OR
- a separate `shows` collection.

The endpoints below assume a simple theatre-movie association.

### Add a movie to a theatre

```
POST : /mba/api/v1/theatres/:theatreId/movies
```

Auth: Required (`CLIENT` owner, approved) or (`SYSTEM_ADMIN`/`ROOT_ADMIN`)

Body (example):

```json
{
    "movieId": "<movieId>",
    "showTimes": ["2026-01-01T19:30:00.000Z", "2026-01-01T22:30:00.000Z"],
    "price": 12.5
}
```

### Remove a movie from a theatre

```
DELETE : /mba/api/v1/theatres/:theatreId/movies/:movieId
```

Auth: Required (`CLIENT` owner, approved) or (`SYSTEM_ADMIN`/`ROOT_ADMIN`)

### List all movies running in a theatre

```
GET : /mba/api/v1/theatres/:theatreId/movies
```

Public: Yes

### List all theatres where a movie is running

```
GET : /mba/api/v1/movies/:movieId/theatres
```

Public: Yes

---

## Bookings

Booking rules:

- Only authenticated users (`CUSTOMER`, possibly `CLIENT` too) can book.
- Bookings may be `CREATED`, `CONFIRMED`, `CANCELLED`, `EXPIRED`.

### Create a booking

```
POST : /mba/api/v1/bookings
```

Auth: Required

Body (example):

```json
{
    "theatreId": "<theatreId>",
    "movieId": "<movieId>",
    "showTime": "2026-01-01T19:30:00.000Z",
    "seats": ["A1", "A2"],
    "paymentMode": "CARD"
}
```

### Get booking details

```
GET : /mba/api/v1/bookings/:id
```

Auth: Required (owner) or admin

### Cancel a booking

```
PATCH : /mba/api/v1/bookings/:id/cancel
```

Auth: Required (owner) or admin

Body (optional example):

```json
{ "reason": "Change of plans" }
```

### List my bookings (upcoming/past)

```
GET : /mba/api/v1/bookings
```

Auth: Required

Query params (optional):

- `type=upcoming|past|all` (default: upcoming)
- `status=CREATED|CONFIRMED|CANCELLED|EXPIRED`
- `page=1&limit=20`

---

## Payments / Transactions

Note: actual payment gateway integration differs by provider. These endpoints document a generic flow.

### Initiate payment for a booking

```
POST : /mba/api/v1/payments
```

Auth: Required

Body (example):

```json
{
    "bookingId": "<bookingId>",
    "provider": "stripe",
    "amount": 25.0,
    "currency": "USD"
}
```

### Confirm payment (webhook or client confirm)

If using webhooks, this may be unauthenticated but signed/verified by provider.

```
POST : /mba/api/v1/payments/webhook
```

### Get transaction by id

```
GET : /mba/api/v1/payments/:id
```

Auth: Required (owner) or admin

---

## Ratings & Reviews

### Add a rating/review for a movie

```
POST : /mba/api/v1/movies/:movieId/reviews
```

Auth: Required

Body (example):

```json
{
    "rating": 5,
    "comment": "Amazing visuals and soundtrack!"
}
```

### List reviews for a movie

```
GET : /mba/api/v1/movies/:movieId/reviews
```

Public: Yes

---

## System Admin (super-user access)

These endpoints are intended for `SYSTEM_ADMIN` / `ROOT_ADMIN`.

### CRUD any resource (admin)

If you keep normal CRUD endpoints protected by role, you may not need separate admin routes.
If you do want explicit admin routes, a common pattern is:

- Movies: `POST/PUT/DELETE /mba/api/v1/movies...`
- Theatres: `POST/PUT/DELETE /mba/api/v1/theatres...`
- Users/Clients: `GET /mba/api/v1/users...`, `PATCH /mba/api/v1/admin/clients/...`

---

## Notes / Suggested data models (high level)

- `User`: name, email, passwordHash, role, status (for clients), createdAt
- `Theatre`: name, location (city/pin/address), clientId(owner), screens, seatMap
- `Movie`: name, description, duration, language, genres
- `Show` (optional but recommended): theatreId, movieId, showTime, price, seatsAvailable
- `Booking`: userId, showId or (theatreId+movieId+showTime), seats, status, totalAmount
- `Payment`: bookingId, userId, provider, amount, currency, status, providerRef