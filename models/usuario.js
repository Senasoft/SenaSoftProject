//recurso para crear la coleccion
import mongoose from 'mongoose';

//crear coleccion
const UsuarioSchema = mongoose.Schema({
    estado : {type : Number, default : 1},                //activo 1 desactivo 1
    nombreUsuario :  {type : String, required : true, unique : true, maxlength : 50},
    password : {type : String, required : true},
    rol : {type : String, required: true, maxlength : 50},
    email : {type : String, required: true, maxlength : 50},
},{
    timestamps : true,
    versionkey : false
})

//exportar coleccion cuando sea requerida
export default mongoose.model('Usuario',UsuarioSchema)

