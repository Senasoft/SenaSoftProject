// para operar sobre la base de datos y las colecciones
import Usuario from "../models/usuario.js";
import bcryptjs from 'bcryptjs';

// servicio de terceros
import cloudinary from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL);

import { generarJWT } from "../middlewares/validarJwt.js";
import { validarTipoFoto } from "../middlewares/validarArchivo.js"

// nombreUsuario password rol email

// variable global que contiene los metodos para invocar los protocolos de http
const usuarioControllers = {

    // agregar usuario
    guardarUsuarioPost : async (req,res)=>{

        // capturar variables
        const {nombreUsuario, password, rol, email, ...resto} = req.body;
        console.log(req.body);
        // limpiar variables
        const nameUser = nombreUsuario.toString().toLowerCase().trim();
        const permisos = rol.toString().toLowerCase().trim();
        const pass = password.toString().trim()
        const correo = email.toString().toLowerCase().trim();

        // crear objeto usuario
        const usuario = Usuario({
            nombreUsuario : nameUser,
            password : pass,
            rol : permisos,
            email : correo
        });

        // numero de capaz para encriptar las password
        const salt = bcryptjs.genSaltSync(1);

        // encriptar password
        usuario.password = bcryptjs.hashSync(pass,salt);

        //guaardar usuario en la bd
        await usuario.save()

        res.json({msg:"Usuario agregado"});
    },

    // iniciar sesion
    iniciarSesionUsuarioPost : async(req, res)=>{
        // capturar variables
        const {nombreUsuario, password} = req.body;

        //limpiar variables
        const nameUser = nombreUsuario.toString().toLowerCase().trim();
        const pass = password.toString().trim();

        //buscar usuario
        const usuario = await Usuario.findOne({nombreUsuario:nameUser});

        //validar contraseña
        const validarPasswordLogin = bcryptjs.compareSync(pass, usuario.password);
        if(!validarPasswordLogin){
            return res.status(400).json({msg:"Usuairo y/o contraseña invalidos"})
        }

        const token = await generarJWT(usuario._id);
        
        res.json({
            nombreUsuario : usuario.nombreUsuario,
            rol : usuario.rol,
            _id : usuario._id,
            token
        })
    },

    //traer usuario por id
    traerUsuarioByIdGet : async(req, res)=>{
        // capturar variable
        const {id} = req.params;

        // buscar por id en la bd
        const usuario = await Usuario.findOne({_id:id});

        // responder
        res.json({usuario})
    },

    //traer lista de usuarios
    traerListaUsuariosGet : async(req, res)=>{
        // capturar variable
        const valor = req.query.value;

        // buscar en la bd
        const usuarios = await Usuario.find({
            $or:[
                {nombreUsuario:new RegExp(valor,'i')},
                {rol : new RegExp(valor,'i')},
                {email : new RegExp(valor,'i')},
            ]
        });

        // responder a cliente
        res.json({usuarios})
    },

    //listar usuarios por fecha de creacion
    traerUsuariosPorFechaCreacion : async(req,res)=>{
        // capturar variable
        const { valor,fechaInicial,fechaFinal } = req.query;


        //verificar la existencia de las variables
        if(fechaInicial==undefined || fechaFinal==undefined){
            return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})
        }

        //validar fecha
        if(!new Date(fechaInicial) == false || !new Date(fechaFinal) == false){
            return res.status(400).json({msg:"Fecha inicial y/o final invalidas"})
        }

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }

        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);

        const usuario = await Usuario.find({
            $and:[
                {createdAt:{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}},
                {
                    $or:[
                        {nombreUsuario:new RegExp(valor,'i')},
                        {rol : new RegExp(valor,'i')},
                        {email : new RegExp(valor,'i')},
                    ]
                } 
            ]
        });

        res.json({usuario})

    },

    //activar usuario
    activarUsuarioPut : async(req, res)=>{
        // capturar variable
        const {id} = req.params;

        //actualizar estado
        const usuario = await Usuario.findByIdAndUpdate(id,{estado : 1});

        //responder al usuario
        res.json({msg:"Usuario activado"})
    },
    
    //desactivar usuario
    desactivarUsuarioPut : async(req, res)=>{
        // capturar variable
        const {id} = req.params;

        //actualizar estado
        const usuario = await Usuario.findByIdAndUpdate(id,{estado : 0});

        //responder al usuario
        res.json({msg:"Usuario desactivado"})
    },

    //actualizar nombre
    actualizarNomreUsuarioPut : async(req,res)=>{
        //recibir varialbes
        const {id} = req.params;
        const{ nombreUsuario } = req.body;

        //limpiar variables
        const nameUser = nombreUsuario.toString().toLowerCase().trim();

        //validar estado de usuario
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg : 'Usuario desactivado'})}

        //actualizar usuario
        const usuario = await Usuario.findByIdAndUpdate(id, {nombreUsuario : nameUser});
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar password
    actualizarPasswordPut : async(req,res)=>{
        //recibir variables
        const {id} = req.params;
        const{ password } = req.body;

        //limpiar variable
        const pass = password.toString().trim()

        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg : 'Usuario desactivado'})}

        //capas de encriptacion
        const salt = bcryptjs.genSaltSync(1);

        //encriptar
        const passworde = bcryptjs.hashSync(pass,salt);

        //actualizar 
        const usuario = await Usuario.findByIdAndUpdate(id, {password : passworde});
        res.json({msg:"Constraseña actualizada"}) 
    },

    // actualiar rol
    actualizarRolPut : async(req,res)=>{
        //recibir varialbes
        const {id} = req.params;
        const{ rol } = req.body;

        //limpiar variables
        const permisos = rol.toString().toLowerCase().trim();

        //validar estado de usuario
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg : 'Usuario desactivado'})}

        //actualizar usuario
        const usuario = await Usuario.findByIdAndUpdate(id,{rol : permisos});
        res.json({msg:"Rol actualizado"})
    },


    // actualizar email
    actualizarEmailPut : async(req,res)=>{
        //recibir varialbes
        const {id} = req.params;
        const{ email } = req.body;

        //limpiar variables
        const address = email.toString().trim();

        //validar estado de usuario
        const user = await Usuario.findOne({_id : id})
        if (user.estado === 0) {return res.status(400).json({msg : 'Usuario desactivado'})}

        //actualizar usuario
        const usuario = await Usuario.findByIdAndUpdate(id, {email : address});
        res.json({msg:"Email actualizado"})
    },

    // eliminar
    eliminarUsuarioDelte : async(req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        
        //Eliminar cliente por id
        const persona = await Usuario.findByIdAndDelete(id);
        res.json({msg:"Usuario eliminada"})
    },

    // cargar foto unica por usuario a cloudinary
    cargarImagenUnicaUsuarioPost : async (req,res)=>{
        // capturar variable
        const {id} = req.params;

        //atrapar errores
        try {

            //validar tipo archivo
            const validar = await validarTipoFoto(req.files,undefined);

            // atrapar archivo
            const {tempFilePath} = req.files.archivo;

            //subir archivo
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

            // traer usuario
            let usuario = await Usuario.findOne({_id : id});

            //verificar si tiene foto
            if(usuario.foto){
                // divir la url por por /
                const nombreTemporal = usuario.foto.split('/');

                //tomar la ultima pocisicon donde esta el nombre
                const nombreArchivo = nombreTemporal[nombreTemporal.length - 1]

                //separar nombre de la extencion
                const [public_id] = nombreArchivo.split('.');

                //eliminar el archivo en cloudinary
                cloudinary.uploader.destroy(public_id);
            }

            //guardar url de la foto en la propiedad
            usuario = await Usuario.findByIdAndUpdate(id,{foto:secure_url})

            res.json({msg : "Foto actualizada"});
        } catch (error) {
            res.status(400).json({error})
        }
    },

    // traer foto unica por usuario desde cloudinary
    traerImagenUnicaUsuario : async (req,res)=>{

        // capturar variables
        const {id} = req.params;

        try {
            
            // traer usuario
            let usuario = await Usuario.findOne({_id : id});

            // enviar la url de la imagen
            if(usuario.foto){
                return res.json({url:usuario.foto});
            }

            res.status(400).json({msg : "Falta imagen"})

        } catch (error) {
            res.status(400).json({error})
        }
    }


}

//exportar cuando este arcivo js sea invocado o requerido
export default usuarioControllers