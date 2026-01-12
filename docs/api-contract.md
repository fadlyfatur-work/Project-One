Status code rules:
200 OK: GET/PUT/PATCH sukses
201 Created: POST create
400 Validation error
401 Unauthenticated
403 Forbidden (role USER akses admin)
404 Not found
500 Unexpected

Register

- POST /api/v1/auth/register
req
{
    "email" : "",
    "username" : "",
    "password" : ""
}

res
{
    "data":{
        "userId" : "..."
    }
}