- authentication(login/signup) & authorization(role)
[
    1: root admin - registered in the db {no api endpoint}
    2: other system admin
    3: clients register to the system but will require approval from admin
    4: customers {normal users}
    5: login api will work on token based auth
]

- list movies & halls
[
    1: setup movie theatre resources
    2: creation of a new theatre, ability to update an existing one, fetch all the theatres, filter the theatre based on pin/city & delete a theatre
    3: add movies in a theatre, remove movies in a threatre, list all theatre in which a movie is running, search for a movie, all movies from a theatre, details about movie
]

- booking
[
    setup data model for booking and transactions {
        - authenticated users can book a movie
        - ability to cancel a booking
        - ability to make payment
        - list all your bookings (upcoming/past)
    }
]

- actor profiles
[
    system-admin {
        1: administrator of the whole system
        2: super user access
        3: crud operations on all resources
        4: crud operations on clients
    }
]

- clients
[
    owers of the movie hall, one client can be the owner of multiple hall
    - halls {
        crud operations only on the theatre 
    }
]

- registered users
[
    our main end users/customers visiting the app and have details registered into the system
    {
        - browser movie and theatre
        - book/cancel a booking
        - list all bookings
        - drop ratings and reviews
    }
]

- unregistered users
[
    there are those users who are visiting the app but not registered in the system
    {
        browse and view
    }
]