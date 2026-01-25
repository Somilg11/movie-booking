# Users API

## Overview
Endpoints for users to manage their own profile.

## Endpoints

### 1. Get My Profile
- **URL**: `/mba/api/v1/users/me`
- **Method**: `GET`
- **Auth**: Required

#### Response Example
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": "60d...",
            "name": "Alex Doe",
            "email": "alex@example.com",
            "role": "CUSTOMER",
            "phone": "+1234567890"
        }
    }
}
```

---

### 2. Update My Profile
- **URL**: `/mba/api/v1/users/me`
- **Method**: `PATCH`
- **Auth**: Required

#### Request Example
```json
{
    "name": "Alex Smith",
    "phone": "+19876543210"
}
```

#### Response Example
```json
{
    "status": "success",
    "data": {
        "user": {
            "name": "Alex Smith",
            "phone": "+19876543210"
        }
    }
}
```
