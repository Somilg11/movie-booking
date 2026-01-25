# Shows API

## Overview
A "Show" represents a specific screening of a Movie in a specific Theatre Screen at a specific Time. It manages inventory (seats) and pricing.

## Endpoints

### 1. Create Show
- **URL**: `/mba/api/v1/shows`
- **Method**: `POST`
- **Auth**: Required (`CLIENT` Owner / `ADMIN`)

#### Request Example
```json
{
  "movieId": "60d5ec...",
  "theatreId": "60d6fa...",
  "screenName": "Screen 1",
  "startTime": "2026-02-14T18:00:00Z",
  "endTime": "2026-02-14T21:00:00Z",
  "price": 15.50,
  "totalSeats": 100
}
```

#### Response Example (201 Created)
```json
{
    "status": "success",
    "data": {
        "show": {
            "id": "60d...",
            "availableSeats": 100,
            "startTime": "2026-02-14T18:00:00Z"
        }
    }
}
```

---

### 2. Get Shows by Movie
Find where a movie is playing.

- **URL**: `/mba/api/v1/shows/movie/:movieId`
- **Method**: `GET`
- **Auth**: Public

#### Response Example
```json
{
    "status": "success",
    "data": {
        "shows": [
            {
                "id": "...",
                "theatreId": { "name": "Grand Cinema", "city": "New York" },
                "startTime": "2026-02-14T18:00:00Z",
                "price": 15.50
            }
        ]
    }
}
```

---

### 3. Get Shows by Theatre
See schedule for a theatre.

- **URL**: `/mba/api/v1/shows/theatre/:theatreId`
- **Method**: `GET`
- **Auth**: Public
