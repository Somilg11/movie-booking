# Movie & Theatre API Documentation

Base path: `/mba/api/v1`

## Movies

> **Note**: Only `SYSTEM_ADMIN` or `ROOT_ADMIN` can perform write operations (Create, Update, Delete) on movies. Public can only read.

### Create Movie
**POST** `/movies`

**Auth**: Admin required

**Body**:
```json
{
  "name": "Inception",
  "description": "A thief who steals corporate secrets through the use of dream-sharing technology...",
  "durationMins": 148,
  "language": "English",
  "genres": ["Sci-Fi", "Action", "Thriller"],
  "releaseDate": "2010-07-16",
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/..."
}
```

**Response**: `201 Created`
```json
{
  "movie": {
    "id": "679...",
    "name": "Inception",
    "slug": "inception",
    ...
  }
}
```

### List Movies
**GET** `/movies`

**Auth**: Public

**Query Params**:
- `page` (default 1)
- `limit` (default 20)
- `search`: Search by name (partial match)
- `genre`: Filter by genre
- `language`: Filter by language

**Response**: `200 OK`
```json
{
  "movies": [ ... ],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

### Get Movie Details
**GET** `/movies/:id`

**Auth**: Public

**Response**: `200 OK`
```json
{
  "movie": { ... }
}
```

### Update Movie
**PUT** `/movies/:id`

**Auth**: Admin required

**Body**: (Partial updates allowed)
```json
{
  "description": "Updated description..."
}
```

**Response**: `200 OK`

### Delete Movie
**DELETE** `/movies/:id`

**Auth**: Admin required

**Response**: `200 OK`

---

## Theatres

> **Note**: `CLIENT` (owners) can manage their own theatres. Admins can manage all.

### Create Theatre
**POST** `/theatres`

**Auth**: `CLIENT` (Approved) or Admin

**Body**:
```json
{
  "name": "Grand Cinema",
  "city": "New York",
  "pin": "10001",
  "address": "123 Broadway",
  "screens": 5,
  "seatMap": {
    "screen1": { "rows": 10, "cols": 20, "aisles": [5, 15] }
  }
}
```

**Response**: `201 Created`

### List Theatres
**GET** `/theatres`

**Auth**: Public

**Query Params**:
- `city`
- `pin`
- `movieId`: Filter by theatres showing this movie

**Response**: `200 OK`

### Get Theatre Details
**GET** `/theatres/:id`

**Auth**: Public

### Update Theatre
**PUT** `/theatres/:id`

**Auth**: Owner (Client) or Admin

### Delete Theatre
**DELETE** `/theatres/:id`

**Auth**: Owner (Client) or Admin

---

## Theatre-Movie Mapping (Shows)

### Add Movie to Theatre (Schedule)
**POST** `/theatres/:id/movies`

**Auth**: Owner (Client) or Admin

**Body**:
```json
{
  "movieId": "679...",
  "showTimes": ["2026-02-01T10:00:00Z", "2026-02-01T14:00:00Z"],
  "price": 15.50
}
```

**Response**: `200 OK`

### Get Movies in Theatre
**GET** `/theatres/:id/movies`

**Auth**: Public

**Response**: `200 OK`
```json
{
  "movies": [
    {
      "movieId": "Inception",
      "posterUrl": "...",
      "shows": [
        { "time": "...", "price": 15.50 }
      ]
    }
  ]
}
```

### Remove Movie from Theatre
**DELETE** `/theatres/:id/movies/:movieId`

**Auth**: Owner (Client) or Admin

