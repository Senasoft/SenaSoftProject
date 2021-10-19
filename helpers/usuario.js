import Usuario from '../models/usuario.js';


// validar si existe usuari con ese nombre
const existeUsuarioByNombreUsuario = async(nombreUsuario)=>{
    // limpir variable
    nombreUsuario = nombreUsuario.toString().toLowerCase().trim();
    
    
    //no estar vacio
    if(nombreUsuario.length==0){
        throw new Error("Nombre de usuario vacio");
    }

    //validar longitud
    if(nombreUsuario.length > 50){
        throw new Error("Nombre de usuario supero los 50 caracteres")
    }

    //buscar usuario en la bd
    const usuario = await Usuario.findOne({nombreUsuario});

    //validar si existe
    if(usuario){
        throw new Error("Nombre de usaurio ya existente")
    }
}

//validar password
const validarPassword = async(password)=>{
    //limpiar variable
    password = password.toString().trim();
    // validar longitud
    if(password.length > 10){
        throw new Error("Contraseña supero los 10 caracteres")
    }
    if(password.length == 0){
        throw new Error("Contraseña vacia")
    }
}

//validar rol de usuarios
const validarRolUsuario = async(rol)=>{
    // limpiar variable
    rol = rol.toString().toLowerCase().trim()
    if(rol != "administrador" && rol != 'vendedor'){
        throw new Error("Rol de usuario invalido")
    }
}

//validar email de usuario al agregar un usuario
const validarEmaiAgregarUser = async(email)=>{
    //limpiar variable
    email = email.trim();
    if(email.length > 50){
        return "Email supero los 50 caracteres"
    }

    return true
}

//validar si existe nombre de usuario
const validarExisteNombreUsuario = async(nombreUsuario)=>{
    // limpir variable
    nombreUsuario = nombreUsuario.toString().toLowerCase().trim();
    
    
    //no estar vacio
    if(nombreUsuario.length==0){
        throw new Error("Usuairo y/o contraseña invalidos");
    }

    //validar longitud
    if(nombreUsuario.length > 50){
        throw new Error("Usuairo y/o contraseña invalidos")
    }

    //buscar usuario en la bd
    const usuario = await Usuario.findOne({nombreUsuario});

    //validar si existe
    if(!usuario){
        throw new Error("Usuairo y/o contraseña invalidos")
    }
}

// validar existencia de usuairo por id
const existeUsuarioById = async(id)=>{
    const usuario = await Usuario.findById(id);
    if(!usuario){
        throw new Error("No existe usuario con ese id")
    }
}

const validarEmailUsuario = async(email)=>{
    // limpiar variable
    email = email.toString().trim();
    
    // calidar longitud
    if(email.length > 50){
        throw new Error("Email supero los 50 caracteres")
    }
    if(email.length == 0){
        throw new Error("Email vacio")
    }
}


export {
    existeUsuarioByNombreUsuario,
    validarPassword,
    validarRolUsuario,
    validarEmaiAgregarUser,
    validarExisteNombreUsuario,
    existeUsuarioById,
    validarEmailUsuario
}