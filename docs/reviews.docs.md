# Reviews API

## Overview
Allows users to rate and review movies.

## Endpoints

### 1. Add Review
- **URL**: `/mba/api/v1/reviews`
- **Method**: `POST`
- **Auth**: Required (`CUSTOMER`)

#### Request Example
```json
{
    "movieId": "60d5ec...",
    "rating": 5,
    "comment": "Absolutely stunning visuals and a great story!"
}
```
*Note: One review per movie per user.*

#### Response Example
```json
{
    "status": "success",
    "data": {
        "review": {
            "id": "...",
            "rating": 5,
            "comment": "..."
        }
    }
}
```

---

### 2. Get Reviews
- **URL**: `/mba/api/v1/reviews`
- **Method**: `GET`
- **Auth**: Public

#### Query Params
- `movieId`: Required filter

#### Response Example
```json
{
    "status": "success",
    "data": {
        "reviews": [
            {
                "rating": 5,
                "comment": "Great!",
                "user": { "name": "Alex" }
            }
        ]
    }
}
```
