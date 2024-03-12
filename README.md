# Helldivers Blog API

Este proyecto proporciona una API RESTful para un blog dedicado al juego Helldivers. Permite a los usuarios crear, leer, actualizar y eliminar publicaciones de blog relacionadas con estrategias, noticias y contenido de Helldivers.

## Características

- **Operaciones CRUD**: Realiza operaciones de Crear, Leer, Actualizar y Eliminar en las publicaciones del blog.
- **Soporte Docker**: Incluye configuración de Docker para una configuración y despliegue fáciles.
- **Documentación con Swagger**: API documentada con Swagger para fácil referencia y prueba.

## Comenzando

### Prerrequisitos

- Node.js
- MySQL
- Docker (opcional)

### Instalación

1. Clona el repositorio:

    git clone https://github.com/DanielDubon/sample-api.git
 

2. Instala las dependencias:

   
    cd helldivers_blog
    npm install
   

3. Configura la base de datos MySQL:

    - Ejecuta MySQL en tu máquina local o usa Docker para crear una imagen y correr la instancia de la base de datos con mysql2, y configura los detalles de conexión a tu base de datos.
    - Ejecuta el script `schema.sql` para crear la base de datos y las tablas necesarias.

4. Configura los detalles de conexión a tu base de datos en `src/conn.js`.

5. Inicia la aplicación:

  
    npm start


## Uso

Consulta la documentación de Swagger disponible en el endpoint `/docs` para obtener información detallada sobre el uso de la API.

