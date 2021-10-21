// para operar sobre la base de datos y las colecciones
import Paciente from '../models/paciente.js';

// variable global que contiene los metodos para invocar los protocolos de http
const pacienteControllers = {

  // agregar paciente
  guardarPacientePost : async (req,res)=>{

      // capturar variables
      const {nombre, apellido, cedula, ...resto} = req.body;
      console.log(req.body);
      // limpiar variables
      const namePaciente = nombre.toString().toLowerCase().trim();
      const lasNamePaciente = apellido.toString().toLowerCase().trim();
      const cedulaPaciente = cedula.trim();

      // crear objeto paciente
      const paciente = Paciente({
          nombre   : namePaciente,
          apellido : lasNamePaciente,
          cedula   : cedulaPaciente
      });

      //guardar paciente en la bd
      await paciente.save()

      res.json({msg:"Paciente agregado"});
  },

  //traer lista de usuarios
  traerListaPacientesGet : async(req, res)=>{
    // capturar variable
    const valor = req.query.value;

    // buscar en la bd
    const pacientes = await Paciente.find({
        $or:[
            {nombre:new RegExp(valor,'i')}
        ]
    });

    // responder a cliente
    res.json({pacientes})
},

  //traer paciente por id
  traerPacienteByIdGet : async(req, res)=>{
    // capturar variable
    const {id} = req.params;

    // buscar por id en la bd
    const paciente = await Paciente.findOne({_id:id});

    // responder
    res.json({paciente})
},


  //activar usuario
  activarPacientePut : async(req, res)=>{
    // capturar variable
    const {id} = req.params;

    //actualizar estado
    const paciente = await Paciente.findByIdAndUpdate(id,{estado : 1});

    //responder al usuario
    res.json({msg:"Paciente activado"})
},

  //activar usuario
  desactivarPacientePut : async(req, res)=>{
    // capturar variable
    const {id} = req.params;

    //actualizar estado
    const paciente = await Paciente.findByIdAndUpdate(id,{estado : 0});

    //responder al usuario
    res.json({msg:"Paciente desactivado"})
  },

  //Paciente Delete
  eliminarPacietne : async(req,res)=>{
    //recibir variables de peticion
    const {id} = req.params;
    
    //Eliminar usuario por id
    const paciente = await Paciente.findByIdAndDelete(id);
    res.json({msg:'Paciente eliminado'});
  }
}

//exportar cuando este arcivo js sea invocado o requerido
export default pacienteControllers;