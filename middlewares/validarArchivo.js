
// validar que halla archivo en la peticion
const validarExistenciaArchivo = (req, res, next) =>{
    
    //validar que no este vacio, validar que sea un objeto, validar que venga la variable archivo
    if(!req.files || Object.keys(req.files).length===0 || !req.files.archivo ){
        return res.status(400).json({msg:"No hay archivo en la peticion"})

    }

    next();
}

//validar tipo de archivo foto
const validarTipoFoto = (files, extensionesValidas = ['png', 'jpg'])=>{
    // trabajar con promesa recomienda libreria
    return new Promise((resolve,reject)=>{
        //capturar variables
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, solo ${extensionesValidas}`)
        }

        resolve(true)
    })
}

export {
    validarExistenciaArchivo,
    validarTipoFoto   
}