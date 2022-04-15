# How to use this API <br>

## End point */users* method GET<br>

Returns a list of all users<br>

### Response<br>
>[<br>
>    {<br>
>        "_id": "62596177438505704b60b2b2",<br>
>        "email": "email@gmail.com",<br>
>        "firstName": "Name",<br>
>        "lastName": "Surname",<br>
>        "birthDate": "yyyy-MM-dd",<br>
>        "password": "some password",<br>
>        "__v": 0<br>
>    },<br>
>    {<br>
>        "_id": "62596360a3796f2fb417497b",<br>
>        "email": "...@gmail.com",<br>
>        "firstName": "Name",<br>
>        "lastName": "Surname",<br>
>        "birthDate": "yyyy-MM-dd",<br>
>        "password": "some password",<br>
>        "__v": 0<br>
>    }<br>
>]<br>

## End point */users* method POST<br>

Creates a user with a unique email address<br>

### Receives an Object of standard<br>

>    {<br>
>        "email": "mail@gmail.com",<br>
>        "firstName": "Name",<br>
>        "lastName": "Surname",<br>
>        "birthDate": "yyyy-MM-dd",<br>
>        "password": "password"<br>
>    }<br>

### Example of such request<br>
>localhost:3000/users?email=mail@gmail.com&firstName=Liliia&lastName=Allansson&birthDate=1998-12-10&password=mypass <br>

### Response<br>
>"62596360a3796f2fb417497b"   - an ID of the newly created record<br>


## End point */users/[email]* method GET<br>

Returns a single user by email address and password<br>

### Example of such request<br>

>localhost:3000/users/mymail@gmail.com?password=mypass<br>

### Response<br>
>{
>    "_id": "62596177438505704b60b2b2",
>    "email": "mymail@gmail.com",
>    "firstName": "Name",
>    "lastName": "Surname",
>    "birthDate": "yyyy-MM-dd",
>    "password": "mypass",
>    "__v": 0
>}

## End point */records/[userID]* method GET<br>

Will return all records for a specified user.<br>

### Example of such request<br>

>localhost:3000/records/62596360a3796f2fb417497b<br>

### Response<br>
>[<br>
>    {<br>
>        "_id": "6259887a2d5216427152a740",<br>
>        "userID": "625987150ae68c9cb02e8f1f",<br>
>        "systolic": 120,<br>
>        "diastolic": 65,<br>
>        "heartRate": 63,<br>
>        "createdAt": "2022-04-15T15:00:10.611Z",<br>
>        "updatedAt": "2022-04-15T15:00:10.611Z",<br>
>        "__v": 0<br>
>    },<br>
>   ...<br>
>    {<br>
>        "_id": "6259899b84996afd09cf5ec1",<br>
>        "userID": "625987150ae68c9cb02e8f1f",<br>
>        "systolic": 90,<br>
>        "diastolic": 63,<br>
>        "heartRate": 75,<br>
>        "createdAt": "2022-04-15T15:04:59.858Z",<br>
>        "updatedAt": "2022-04-15T15:04:59.858Z",<br>
>        "__v": 0<br>
>    }<br>
>]<br>

## End point */records/[userID]* method POST<br>

Adds a health status record for a specified user. Returns evaluation of current health status of the user.<br>

### Example of such request<br>

>localhost:3000/records/62596360a3796f2fb417497b?systolic=60&diastolic=90&heartRate=65<br>

### Response<br>
>"You might need to contact a doctor" <br>
>Or "Normal blood pressure", etc.<br>