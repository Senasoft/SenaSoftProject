import Paciente from "../models/paciente.js";

//Validar si existe el Id
const existePacienteById = async(id)=>{
  const paciente = await Paciente.findById(id);
  if(!paciente){
      throw new Error("No existe paciente con ese id")
  }
}

//Validar si existe cedula
const existeCedula = async(cedula)=>{
  cedula = cedula.trim();
  
  //Buscar cedula en la bd
  const Cedula = await Paciente.findOne({cedula});

  //Validar si existe
  if(Cedula){
    throw new Error("Cedula ya existente")
  }
}

export {
  existePacienteById,
  existeCedula
}