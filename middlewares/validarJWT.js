// importar dependencias y recursos a usar
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const generarJWT = (uid = '')=>{
    return new Promise((resolve, reject)=>{

        const payload = {uid}

        //crear enciptacion
        jwt.sign(payload, process.env.SECREPRIVATEKEY,{
            //tiempo de duracion
            expiresIn:'7d'
        },(err,token)=>{
            if(err){
                reject('No se pudo generar token')
            }else{
                resolve(token)
            }
        })
    })
}

const validarJWR = async(req, res, next) =>{
    // capturar variable token
    const token = req.header('token');

    // verificar que no este vacio
    if(!token){
        return res.status(400).json({msg:"No hay token en la peticion"})
    }

    try{
        // desencriptar token
        const {uid} = jwt.verify(token,process.env.SECREPRIVATEKEY);

        // buscar usuario en la bd
        const usuario = await Usuario.findById(uid);

        //validar que exista usuario
        if(!usuario){
            return res.status(400).json({msg : "No existe usuario para ese token"})
        }

        if(usuario.estado == 0){
            return res.status(400).json({msg : "Usuario sin permisos"})
        }

        req.usuario = usuario
        next()

    }catch(error){
        return res.status(401).json({msg : "Token invalido"})
    }
}


//exportar funciones de validacion y creacion de token
export {generarJWT, validarJWR}