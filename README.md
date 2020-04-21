# NodeJS-mongoDB-API


## Ejecutar el proyecto

```
$ git clone https://github.com/edgarMejia/NodeJS-mongoDB-API.git
$ cd NodeJS-mongoDB-API
$ npm install
$ npm start
```

El proyecto se sirve en el puerto `3000`

## Endpoints

| Type | Endpoint | Description |
| --- | --- | --- |
| GET | `BASE_URL`/api/todo/get | Obtener toda la lista de tareas |
| POST | `BASE_URL`/api/todo/save | Guardar una nueva tarea |


Para método de guardado es necesario enviar el header:

`'Content-Type': 'application/x-www-form-urlencoded'`


## Response

```json
{
    "success": true,
    "message": "Some message",
    "data": []
}
```
