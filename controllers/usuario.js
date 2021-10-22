// para operar sobre la base de datos y las colecciones
import Usuario from "../models/usuario.js";
import bcryptjs from 'bcryptjs';

import PDFDocument from 'pdfkit';

// funciones de apoyo
import { validarFormulario } from '../amazon/amazontext.js'
import * as fs from 'fs'

// rutas dentro del servidor
import path from 'path'
import url from 'url'

// import PdfPrinter from 'pdfmake';
// import fonts from './fonts.js';
// import styles from './styles.js';


// servicio de terceros
import cloudinary from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL);
import fetch from 'fetch';




// funciones de apoyo
import { subirArchivo } from '../helpers/subirArchivo.js';

//token
import { generarJWT } from '../middlewares/validarjtw.js';

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
        const {email, password} = req.body;

        //limpiar variables
        const correo = email.toString().toLowerCase().trim();
        const pass = password.toString().trim();

        //buscar correo
        const usuario = await Usuario.findOne({email:correo});

        //validar correo
        const Email = await Usuario.findOne({email});
        if (!Email) {
            return res.status(404).json({msg:"Correo y/o contraseña invalidos"})
        }

        //validar contraseña
        const validarPasswordLogin = bcryptjs.compareSync(pass, usuario.password);
        if(!validarPasswordLogin){
            return res.status(400).json({msg:"Correo y/o contraseña invalidos"})
        }

        const token = await generarJWT(usuario._id);
        
        res.json({
            usuario,
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

    // eliminar
    eliminarUsuarioDelte : async(req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        
        //Eliminar usuario por id
        const persona = await Usuario.findByIdAndDelete(id);
        res.json({msg:"Usuario eliminada"})

    },

    //Amazon 
    operarImagenes : async (req,res) =>{

        
       
        //capturar archivos
        const archivos = req.files.archivo;
        console.log(archivos);

        if(archivos.length == undefined){
            return res.json({msg:"Faltan imagenes"})
        }

        var error = "";
        var direccionesLocales = [];
        var i=0

        for( var archivo of archivos){
            try{
                const nombreListos = await subirArchivo(archivo,undefined);
                direccionesLocales.push(nombreListos);
            }catch(err){
                error = err;
                break;
            }            
        }

        // si ocurre un error borrar arcivos
        if(error!==""){
            console.log(error);
            for(var element of direccionesLocales){
                if(fs.existsSync(element)){
                    fs.unlinkSync(element)
                }
            }
            return res.json({error:error});
        }

        const validarAmazon = await validarFormulario(direccionesLocales);

        console.log("--------------valido amazon-----------------------");
        console.log(validarAmazon);
        console.log("--------------valido amazon-----------------------");

        // validar campos de los formularios

        for(var validar of validarAmazon){
            if(validar.EDAD==""){
                for(var element of direccionesLocales){
                    if(fs.existsSync(element)){
                        fs.unlinkSync(element)
                    }
                }
                return res.status(400).json("falta edad")
                
            }
        }


        var nombrePaciente = "Name";
        var fechaHistoria = "Date";


        // for(var element of validarAmazon){
        //     nombrePaciente = element.;
        //     fechaHistoria = ;
        // }

      
        


        const nombreDocumento = nombrePaciente+"_"+fechaHistoria;




        var listarImagenes =[];
        for(var element of direccionesLocales){
            listarImagenes.push({image:element})
        }

        var docDefinition = {
            content:listarImagenes,
            //styles:styles,

        }

        //extrae la carpeta de donde esta instalado
        const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
        
        //ruta donde voy a subir
        const uploadPath = path.join(__dirname,'../pdf/',`"${nombreDocumento}"`,'.pdf');


        // const printer = new PdfPrinter(fonts);
        // let pdfDoc = pinter.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(fs.createWriteStream(`${uploadPath}`))
        // pdfDoc.end();

        console.log("---------------direcciones locales----------------");
        console.log(direccionesLocales);
        console.log("---------------direcciones locales----------------");


        function PdfConverter(){
            // Crea el documento
            const doc = new PDFDocument();
          
            //Mandar salida, puede ser local o http
            doc.pipe(fs.createWriteStream('./pdf/name_date.pdf'));
          
            // Agregar la imagen, ruta de las misma y persolanizar los parametros
            doc.image(direccionesLocales[0],{
              fit: [500, 600],
              align: 'right',
              valign: 'center'
            });
          
            //Otra imagen
            doc
              .addPage() //<-- agrega una nueva pagina
                doc.image(direccionesLocales[1],{ //<-- ruta de la imagen
                  fit: [500, 600], //<-- tamaño en 'x' y en 'y' 
                  align: 'center',  //<-- Alineamiento
                  valign: 'center'
                });
          
           
            doc.end();
          }
          
          PdfConverter();

          //ruta donde voy a subir
        const rutaPdf = path.join(__dirname,'../pdf/',nombreDocumento);
        console.log("------------- ruta pdf---------");
        console.log(rutaPdf);
        console.log("------------- ruta pdf---------");
        var tempFilePat = rutaPdf

        // try {
        //     //var data = fs.readFileSync(rutaPdf,)
        //     console.log("---------------- data -------------------");
        //     console.log(rutaPdf);
        //     console.log("---------------- data -------------------");

        //     const dattempFilePata = url.pathToFileURL(rutaPdf)


        //     console.log("---------------- dattempFilePata -------------------");
        //     console.log(dattempFilePata);
        //     console.log("---------------- dattempFilePata -------------------");

        //     const {secure_url} = await cloudinary.uploader.upload(dattempFilePata);
            
        // } catch (error) {
        //     console.log("pailas");
        //     return res.status(400).json({msg:error})
        // }

        
        //subir archivo

          
        for(var element of direccionesLocales){
            if(fs.existsSync(element)){
                fs.unlinkSync(element)
            }
        }

        // if(fs.existsSync(rutaPdf)){
        //     fs.unlinkSync(rutaPdf)
        // }


        

        res.json({msg:"guardo con exito"})
    }

}

//exportar cuando este arcivo js sea invocado o requerido
export default usuarioControllers;