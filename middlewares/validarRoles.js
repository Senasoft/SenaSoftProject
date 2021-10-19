//  variable a exportar
const validarRol = (...roles) =>{

    // recibe el req.usuario
    return(req,res,next)=>{

        // si dentro de roles no esta el rol del usuario enviar error
        if(!(roles.includes(req.usuario.rol) || req.usuario.rol === 'administrador')){
            return res.status(400).json({msg: `El servicio requiere roles de ${roles}`})
        }
        next();
    }
}

// exportar la validacion
export{validarRol}