//solicitar la dependencia de dotenv para usar los datos almacenado en .env
import {} from 'dotenv/config.js';
//solicitar datos del archivo server.js en la carpeta models
import Server from './models/server.js';
//crear instancia del servidor 
const server = new Server();
//iniciar servidor
server.listen();