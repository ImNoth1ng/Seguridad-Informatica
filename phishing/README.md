Este proyecto es un ejemplo de aplicación enfocada en **Seguridad Informática**, donde se muestra una implementación de un panel de "phishing" con **Total.js**, integrando el envío de correos y el almacenamiento de registros en una base de datos MySQL. El objetivo es **demostrar** y **analizar** prácticas de ataque de ingeniería social, con fines educativos, en un entorno controlado.

A continuación se describen los pasos para **replicar** este repositorio y hacerlo funcionar en tu sistema local.

#### 1. Clonar el repositorio

Clona el repositorio desde GitHub:

``` bash
git clone https://github.com/ImNoth1ng/Seguridad-Informatica.git
cd Seguridad-Informatica/phishing
```

#### 2. Requisitos previos

Para ejecutar la aplicación se requiere contar con:

1.  **Node.js** (Versión 14 o superior).
2.  **npm** o **yarn** (para instalar dependencias).
3.  **MySQL** o **MariaDB** (corriendo localmente o en algún servidor).

#### 3. Configuración de la base de datos

Crea una base de datos y un usuario con permisos de acceso. Después, ejecuta el script SQL que se encuentra en este repositorio (o en caso de que no exista un archivo .sql, usa el siguiente contenido):

``` sql
CREATE DATABASE IF NOT EXISTS phishing_db;
USE phishing_db;

CREATE TABLE IF NOT EXISTS correos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  visto TINYINT(1) DEFAULT 0,
  click VARCHAR(10) DEFAULT 'off',
  user VARCHAR(255),
  password VARCHAR(255)
);

-- Puedes agregar más tablas según tus necesidades
```

Asegúrate de ajustar la configuración para tu usuario y contraseña de MySQL.

#### 4. Configuración de la aplicación

1.  En la carpeta `phishing`, localiza el archivo `models/database.js` donde se configura la conexión MySQL. Asegúrate de editar los valores de host, usuario, contraseña y nombre de la base de datos:

    ``` js
    const mysql = require('mysql2/promise');

    const pool = mysql.createPool({
        host: 'localhost',
        user: 'TU_USUARIO',       // Ajustar
        password: 'TU_PASSWORD',  // Ajustar
        database: 'phishing_db'   // Ajustar
    });

    module.exports = pool;
    ```

    Con estos datos, la aplicación podrá conectarse a tu servidor de base de datos.

2.  Asegúrate de que la sección de rutas en `controllers/` (por ejemplo `index.js`, `emails.js`, etc.) haga referencia correctamente a tu `database.js`.

#### 5. Instalación de dependencias

Dentro de la carpeta `phishing`, instala las dependencias con:

``` bash
npm install
```

Esto descargará Total.js y cualquier otra librería que el proyecto requiera (por ejemplo, `mysql2`, `axios`, etc.).

#### 6. Ejecución de la aplicación

Para iniciar la aplicación, utiliza:

``` bash
node index.js
```

o

``` bash
npm start
```

Si la aplicación se inicia correctamente, debería escuchar por defecto en `http://0.0.0.0:4443` o la dirección que se haya configurado en el archivo de configuración de Total.js.

#### 7. Acceso y pruebas

1.  Abre tu navegador en `http://0.0.0.0:4443/dashboard` (o la ruta que corresponda) para ver el panel donde se listan los correos capturados (si la lógica del proyecto así lo establece).
2.  Para enviar un nuevo correo, dirígete a la ruta `http://0.0.0.0:4443/nuevo-correo` (o la que hayas configurado en las vistas).
3.  Revisa los registros en la base de datos a través del panel de MySQL o tu herramienta favorita. Verifica si los campos `visto` y `click` cambian según las acciones del usuario final.

#### 8. Notas de seguridad

Este proyecto tiene propósitos **exclusivamente educativos**. Se recomienda:

- No usarlo en entornos de producción.
- No enviar correos de phishing a personas ajenas sin su consentimiento.
- Emplear este código como ejemplo de prácticas de seguridad y para aprender a defenderse de posibles ataques.

#### 9. Contribuciones

Si deseas colaborar, puedes realizar un **Fork** del repositorio y crear un **Pull Request** con tus mejoras o correcciones.
