# How to use this API <br>

## Disclamer: All the methods requiring authentication might return
>{
>    "error": "Unauthorized"
>}

## End point */users* method GET<br>

**Requires authentication!**

Returns a list of all users<br>

### Response<br>
>[<br>
>    {<br>
>        "_id": "62596177438505704b60b2b2",<br>
>        "email": "email@gmail.com",<br>
>        "firstName": "Name",<br>
>        "lastName": "Surname",<br>
>        "birthDate": "yyyy-MM-dd",<br>
>        "password": "some hashed password",<br>
>        "__v": 0<br>
>    },<br>
>    {<br>
>        "_id": "62596360a3796f2fb417497b",<br>
>        "email": "...@gmail.com",<br>
>        "firstName": "Name",<br>
>        "lastName": "Surname",<br>
>        "birthDate": "yyyy-MM-dd",<br>
>        "password": "some hashed password",<br>
>        "__v": 0<br>
>    }<br>
>]<br>

## End point */register* method POST<br>

Creates a user with a unique email address. A hashed version of the password is saved in the DB<br>

### Example of such request<br>
>https://obscure-bayou-38424.herokuapp.com/register + object <br>
>   {<br>
>        email: "xxxx@email",<br>
>        firstName: "firstName",<br>
>        lastName: "lastName",<br>
>        birthDate: "yyyy-MM-dd",<br>
>        password: "password"<br>
>   }<br>

### Response<br>
>"62596360a3796f2fb417497b"   - the ID of the newly created record<br>


## End point */stats/[user_id]* method GET<br>

Returnsan a JSON with two values: the total count of records in the DB and the records count of the logged in user<br>

### Example of such request<br>
>https://obscure-bayou-38424.herokuapp.com/stats/62596360a3796f2fb417497b <br>


### Response<br>
>{<br>
    "totalRecordsCount": 28,<br>
    "userRecordsCount": 8<br>
}<br>

## End point */login* method POST<br>

Returns a single user by email address and password (status 200 or a message (status 404). Session stores the user object<br>

### Example of such request<br>

>https://obscure-bayou-38424.herokuapp.com/login + object<br>

>{<br>
>    "email": "mymail@gmail.com",<br>
>    "password": "password"<br>
>}<br>

## End point */login* method GET<br>

**Requires authentication!**

Returns the current user stored in the session<br>

### Example of such request<br>

>https://obscure-bayou-38424.herokuapp.com/login <br>

### Response<br>
>{<br>
>    "_id": "62596177438505704b60b2b2",<br>
>    "email": "mymail@gmail.com",<br>
>    "firstName": "Name",<br>
>    "lastName": "Surname",<br>
>    "birthDate": "yyyy-MM-dd",<br>
>}<br>
> OR "Not logged in"<br>

## End point */login* method DELETE<br>

**Requires authentication!**

Deletes the current user stored in the session<br>

### Response<br>

> "Logged out"<br>

## End point */records/[user_id]* method GET<br>

**Requires authentication!**

Will return all records for a specified user.<br>

### Example of such request<br>

>https://obscure-bayou-38424.herokuapp.com/records/625987150ae68c9cb02e8f1f<br>

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

## End point */records/[user_id]* method POST<br>

**Requires authentication!**

Adds a health status record for a specified user. Returns evaluation of current health status of the user.<br>

### Example of such request<br>

>https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b' + object <br>
>{<br>
>    systolic: 87,<br>
>    diastolic: 65,<br>
>    heartRate: 72<br>
>}<br>

### Response<br>
>{<br>
>  "_id": "6259887a2d5216427152a740",<br>
>  "verdict": "You might need to contact a doctor" OR other text<br>
>}<br>

## End point */records/[user_id]* method DELETE<br>

**Requires authentication!**

Deletes a health status record for a specified user. Returns the deleted record or nothing.<br>

### Example of such request<br>

>https://obscure-bayou-38424.herokuapp.com/records/62596360a3796f2fb417497b' + object <br>
>{<br>
>    "_id": "6259887a2d5216427152a740"<br>
>}<br>



