# Movies API

## Overview
The Movie module manages the content database. While currently simple, it can be extended to support rich metadata like cast, crew, trailers, etc.

## Endpoints

### 1. Create Movie
Registers a new movie in the system.

- **URL**: `/mba/api/v1/movies`
- **Method**: `POST`
- **Auth**: Required (`SYSTEM_ADMIN`)

#### Request Example
```json
{
    "name": "Interstellar",
    "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    "durationMins": 169,
    "language": "English",
    "genres": ["Sci-Fi", "Adventure", "Drama"],
    "releaseDate": "2014-11-07",
    "posterUrl": "https://example.com/interstellar.jpg"
}
```

#### Response Example (201 Created)
```json
{
    "status": "success",
    "data": {
        "movie": {
            "id": "60d5ec...",
            "name": "Interstellar",
            "slug": "interstellar",
            "active": true
        }
    }
}
```

---

### 2. List Movies
Fetch movies with filtering and pagination.

- **URL**: `/mba/api/v1/movies`
- **Method**: `GET`
- **Auth**: Public

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `name`: Partial search (e.g., `Inter`)
- `genre`: Filter by genre (e.g., `Sci-Fi`)
- `language`: Filter by language (e.g., `English`)

#### Response Example
```json
{
    "status": "success",
    "results": 10,
    "data": {
        "movies": [
            { "id": "...", "name": "Interstellar", "posterUrl": "..." },
            { "id": "...", "name": "Inception", "posterUrl": "..." }
        ]
    }
}
```

---

### 3. Get Movie Details
- **URL**: `/mba/api/v1/movies/:id`
- **Method**: `GET`
- **Auth**: Public

#### Response Example
```json
{
    "status": "success",
    "data": {
        "movie": {
            "id": "...",
            "name": "Interstellar",
            "description": "...",
            "reviews": [] 
        }
    }
}
```
