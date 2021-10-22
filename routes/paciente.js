// solicitar dependencia y script a utilizar
import {Router} from 'express';
import {check} from 'express-validator';
import pacienteControllers from '../controllers/paciente.js';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJWT.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { 
  existePacienteById,
  existeCedula
 } from '../helpers/pacientes.js';

// crear instancia de redireccionamiento
const router = Router();

// agregar paciente
router.post('/agregarPaciente',[
  check('nombre','Nombre del paciente obligatorio').not().isEmpty(),
  check('apellido','Apellido es obligatorio').not().isEmpty(),
  check('cedula','cedula del paceinte es obligatorio').not().isEmpty().custom(existeCedula),

  validarJWR,
  validarRol('administrador','registrador'),

  validarCampo
],pacienteControllers.guardarPacientePost);

// listar los pacientes de la bd
router.get('/listarPacientes',[
  validarJWR,
  validarRol('administrador','registrador'),
  validarCampo
],pacienteControllers.traerListaPacientesGet);

// activar
router.put('/activar/:id',[
  validarJWR,
  validarRol('administrador'),
  check('id','ID no valido').isMongoId(),
  check('id').custom(existePacienteById),
  validarCampo
],pacienteControllers.activarPacientePut);

// Desactivar
router.put('/desactivar/:id',[
  validarJWR,
  validarRol('administrador'),
  check('id','ID no valido').isMongoId(),
  check('id').custom(existePacienteById),
  validarCampo
],pacienteControllers.desactivarPacientePut);

//exportar la instancia cuando sea requerida o invocada
export default router
