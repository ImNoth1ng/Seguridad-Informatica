const options = {}

options.port = 4444;

require('total4/debug')(options);

// debug.js
require('total4');

// Cargar controladores
LOAD('controllers');

// Iniciar la aplicación en modo debug
F.http('debug');