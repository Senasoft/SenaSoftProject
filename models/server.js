//// solicitar recursos de las dependencias
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//// solicitar informacion de la conexion de base de datos
import dbConnection from '../database/config.js';

//// solicitar rutas
import usuario from '../routes/usuario.js';
import paciente from '../routes/paciente.js';

//// crear la clase de servidor
class Server{
    constructor(){
        //puerto de conexion
        this.port = process.env.PORT;
        //servidor
        this.app = express();
        //conectar con base de datos
        this.conectarDB();
        //middlewares
        this.middlewares();
        //rutas
        this.routes();
    }

    // metodo para conetar con base de datos 
    async conectarDB(){
        await dbConnection();
    }

    // metodos para las rutas 
    routes(){
        this.app.use('/api/usuario', usuario);
        this.app.use('/api/paciente', paciente);
    }

    // metodos para llamar los middlewares
    middlewares(){

        // leer json en rutas express
        this.app.use(express.json());

        // validar origen de peticion
        this.app.use(cors());

        // conectar con front-end
        this.app.use(express.static('public'));

        // crear archivos
        this.app.use(fileUpload({
            // crear archivo temporar para subir
            useTempFiles : true,

            // carpeta donde va a guardar archivo temporar
            tempFileDir : '/tmp/',

            // si no existe la cartpeta creela
            createParentPath :  true
        }))
    }

    // metodo para iniciar el servidor
    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`servidor corriendo en el puerto ${this.port}`);
        });
    }
}

//exportar la clase servidor
export default Server