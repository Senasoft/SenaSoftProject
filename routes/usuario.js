// solicitar dependencia y script a utilizar
import {Router} from 'express';
import {check} from 'express-validator';
import usuarioControllers from '../controllers/usuario.js';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJWT.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { validarExistenciaArchivo } from '../middlewares/validarArchivo.js';


import {
    existeUsuarioByNombreUsuario,
    validarPassword,
    validarRolUsuario,
    validarExisteNombreUsuario,
    existeUsuarioById,
    validarEmailUsuario,
    validarEmaiAgregarUser
} from '../helpers/usuario.js'


// crear instancia de redireccionamiento
const router = Router();

// agregar usuario
router.post('/agregar',[
    check('nombreUsuario','Nombre de usuario obligatorio').not().isEmpty().custom(validarExisteNombreUsuario),
    check('password','constraseña de usuario obligatoria').not().isEmpty(),
    check('rol','Rol de usuario obligatorio').not().isEmpty(),
    check('email', 'Email del usuario es obligatorio').not().isEmpty().custom(validarEmaiAgregarUser),
    check('nombreUsuario').custom(existeUsuarioByNombreUsuario),
    check('password').custom(validarPassword),
    check('rol').custom(validarRolUsuario),

    validarJWR,
    validarRol('administrador'),

    validarCampo
],usuarioControllers.guardarUsuarioPost);

// iniciar sesion
router.post('/iniciarSesion',[
    check('email', 'El correo no puede estar vacio').not().isEmpty(),
    check('password','constraseña de usuario obligatoria').not().isEmpty(),
    check('password').custom(validarPassword),

    validarCampo
],usuarioControllers.iniciarSesionUsuarioPost);

// traer usuario por id
router.get('/usuarioById/:id',[
    validarJWR,
    validarRol('administrador'),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    validarCampo
],usuarioControllers.traerUsuarioByIdGet);

// listar los usuarios de la bd
router.get('/listarUsuarios',[
    validarJWR,
    validarRol('administrador'),
    validarCampo
],usuarioControllers.traerListaUsuariosGet);

//listar usuarios por fecha de creacion
router.get('/listarUsuariosFecha',[
    validarJWR,
    validarRol('administrador'),
    validarCampo
],usuarioControllers.traerUsuariosPorFechaCreacion);

// activar
router.put('/activar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.activarUsuarioPut);

// desactivar
router.put('/desactivar/:id',[
    validarJWR,
    validarRol('administrador'),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.desactivarUsuarioPut);

// actualizar nombre
router.put('/actualizarNombre/:id',[
    validarJWR,
    validarRol('administrador'),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    check('nombreUsuario','Nombre de usuario obligatorio').not().isEmpty(),
    check('nombreUsuario').custom(existeUsuarioByNombreUsuario),

    validarCampo
],usuarioControllers.actualizarNomreUsuarioPut);

// eliminar
router.delete('/eliminarUsuario/:id',[
    validarJWR,
    validarRol('administrador'),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.eliminarUsuarioDelte);

// operar con imagenes
router.post('/historiaPaciente',[
    validarExistenciaArchivo,
    validarCampo
],usuarioControllers.operarImagenes)

//exportar la instancia cuando sea requerida o invocada
export default router