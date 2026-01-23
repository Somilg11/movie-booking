# Data Flow Diagrams

## System Overview

```mermaid
graph TD
    User([User])
    Client([Client/Owner])
    Admin([System Admin])

    subgraph "Movie Booking System"
        Auth[Auth Module]
        Movie[Movie Module]
        Theatre[Theatre Module]
        Booking[Booking Module]
        DB[(MongoDB)]
    end

    User -->|Sign Up/Login| Auth
    Client -->|Sign Up/Login| Auth
    Admin -->|Login| Auth

    Admin -->|Create/Manage| Movie
    Client -->|Create/Manage| Theatre

    Movie -->|Read/Write| DB
    Theatre -->|Read/Write| DB

    User -->|Browse| Movie
    User -->|Browse| Theatre
    User -->|Book| Booking
```

## 1. Movie Management Flow (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant API as API Gateway / Router
    participant MovieController
    participant MovieService
    participant DB as MongoDB

    Admin->>API: POST /movies (Token)
    API->>MovieController: createMovie(req)
    MovieController->>MovieService: validate & create
    MovieService->>DB: save(Movie)
    DB-->>MovieService: success
    MovieService-->>MovieController: return Movie
    MovieController-->>Admin: 201 Created
```

## 2. Theatre Management Flow (Client)

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant TheatreController
    participant TheatreService
    participant DB

    Client->>API: POST /theatres (Token)
    API->>TheatreController: createTheatre(req)
    Note over TheatreController: Check if Client is APPROVED
    TheatreController->>TheatreService: createTheatre(data, ownerId)
    TheatreService->>DB: save(Theatre)
    DB-->>TheatreService: success
    TheatreService-->>TheatreController: return Theatre
    TheatreController-->>Client: 201 Created
```

## 3. Mapping Movie to Theatre (Scheduling Shows)

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant TheatreController
    participant TheatreService
    participant DB

    Client->>API: POST /theatres/:id/movies
    Note right of Client: Body: { movieId, showTimes, price }
    API->>TheatreController: addMovieToTheatre(req)
    Note over TheatreController: Auth Check (Owner/Admin)
    TheatreController->>TheatreService: addShow(theatreId, movieId, details)
    TheatreService->>DB: Update Theatre doc (push to movies array)
    DB-->>TheatreService: success
    TheatreService-->>TheatreController: 200 OK
    TheatreController-->>Client: Success
```

## 4. User Booking Flow (High Level)

```mermaid
graph LR
    User -->|1. Select Movie| ListMovies
    User -->|2. Select Theatre| TheatreDetails
    User -->|3. Select Show & Seats| BookingInit
    BookingInit -->|4. Payment| PaymentGateway
    PaymentGateway -->|5. Success| ConfirmBooking
    ConfirmBooking -->|6. Ticket| User
```
