//recurso para crear la coleccion
import mongoose from 'mongoose';

//crear coleccion
const UsuarioSchema = mongoose.Schema({
    estado   : {type : Number, default : 1},            //activo 1 desactivo 1
    nombre   : {type : String, required : true, maxlength : 50},
    apellido : {type : String, required : true, maxlength : 50},
    cedula   : {type : String, required : true, uniqued : true, maxlength : 50},
    historia : {type : Array, default : []}
},{
    timestamps : true,
    versionkey : false
})

//exportar coleccion cuando sea requerida
export default mongoose.model('Paciente',UsuarioSchema)