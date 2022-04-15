# How to use this API <br>

## End point */users* method GET<br>

Returns a list of all users<br>

### Response:<br>
>[
>    {
>        "_id": "62596177438505704b60b2b2",
>        "email": "email@gmail.com",
>        "firstName": "Name",
>        "lastName": "Surname",
>        "birthDate": "yyyy-MM-dd",
>        "password": "***",
>        "__v": 0
>    },
>    {
>        "_id": "62596360a3796f2fb417497b",
>        "email": "...@gmail.com",
>        "firstName": "Name",
>        "lastName": "Surname",
>        "birthDate": "yyyy-MM-dd",
>        "password": "***",
>        "__v": 0
>    }
>]

## End point */users* method POST<br>

Creates a user with a unique email address<br>

### Receives an Object of standard:<br>
>    {
>        "email": "mail@gmail.com",
>        "firstName": "Name",
>        "lastName": "Surname",
>        "birthDate": "yyyy-MM-dd",
>        "password": "password"
>    }

### Response:<br>
"62596360a3796f2fb417497b"   - an ID of the newly cteated record<br>

## End point */records/<userID>* method GET

Will return all records for a specified user.<br>
### Response:<br>
>[
>    {
>        "_id": "6259887a2d5216427152a740",
>        "userID": "625987150ae68c9cb02e8f1f",
>        "systolic": 120,
>        "diastolic": 65,
>        "heartRate": 63,
>        "createdAt": "2022-04-15T15:00:10.611Z",
>        "updatedAt": "2022-04-15T15:00:10.611Z",
>        "__v": 0
>    },
>   ...
>    {
>        "_id": "6259899b84996afd09cf5ec1",
>        "userID": "625987150ae68c9cb02e8f1f",
>        "systolic": 90,
>        "diastolic": 63,
>        "heartRate": 75,
>        "createdAt": "2022-04-15T15:04:59.858Z",
>        "updatedAt": "2022-04-15T15:04:59.858Z",
>        "__v": 0
>    }
>]