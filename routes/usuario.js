// solicitar dependencia y script a utilizar
import {Router} from 'express';
import {check} from 'express-validator';
import usuarioControllers from '../controllers/usuario.js';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { validarExistenciaArchivo } from '../middlewares/validarArchivo.js';
import {
    existeUsuarioByNombreUsuario,
    validarPassword,
    validarRolUsuario,
    validarExisteNombreUsuario,
    existeUsuarioById,
    validarEmailUsuario
} from '../helpers/usuario.js'


// crear instancia de redireccionamiento
const router = Router();

// agregar usuario
router.post('/agregar',[
    check('nombreUsuario','Nombre de usuario obligatorio').not().isEmpty(),
    check('password','constraseña de usuario obligatoria').not().isEmpty(),
    check('rol','Rol de usuario obligatorio').not().isEmpty(),

    check('nombreUsuario').custom(existeUsuarioByNombreUsuario),
    check('password').custom(validarPassword),
    check('rol').custom(validarRolUsuario),

    validarCampo
],usuarioControllers.guardarUsuarioPost);

// iniciar sesion
router.post('/iniciarSesion',[
    check('nombreUsuario','Nombre de usuario obligatorio').not().isEmpty(),
    check('password','constraseña de usuario obligatoria').not().isEmpty(),

    check('nombreUsuario').custom(validarExisteNombreUsuario),
    check('password').custom(validarPassword),

    validarCampo
],usuarioControllers.iniciarSesionUsuarioPost);

// traer usuario por id
router.get('/usuarioById/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    validarCampo
],usuarioControllers.traerUsuarioByIdGet);

// listar los usuarios de la bd
router.get('/listarUsuarios',[
    validarJWR,
    validarRol(),
    validarCampo
],usuarioControllers.traerListaUsuariosGet)

//listar usuarios por fecha de creacion
router.get('/listarUsuariosFecha',[
    validarJWR,
    validarRol(),
    validarCampo
],usuarioControllers.traerUsuariosPorFechaCreacion)

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
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.desactivarUsuarioPut);

// actualizar nombre
router.put('/actualizarNombre/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    check('nombreUsuario','Nombre de usuario obligatorio').not().isEmpty(),
    check('nombreUsuario').custom(existeUsuarioByNombreUsuario),

    validarCampo
],usuarioControllers.actualizarNomreUsuarioPut);

// actualizar password
router.put('/actualizarPassword/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    check('password','Contraseña de usuario obligatorio').not().isEmpty(),
    check('password').custom(validarPassword),
    
    validarCampo
],usuarioControllers.actualizarPasswordPut);

// actualiar rol
router.put('/actualizarRol/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    check('rol','Rol de usuario obligatorio').not().isEmpty(),
    check('rol').custom(validarRolUsuario),
    
    validarCampo
],usuarioControllers.actualizarRolPut);

// actualizar email
// actualiar rol
router.put('/actualizarEmail/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    check('email','Email de usuario obligatorio').not().isEmpty(),
    check('email').custom(validarEmailUsuario),
    
    validarCampo
],usuarioControllers.actualizarEmailPut);

// eliminar
router.delete('/eliminarUsuario/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.eliminarUsuarioDelte);

// cargar foto a cloudinary
router.post('/uploadFoto/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),

    validarExistenciaArchivo,
    validarCampo
],usuarioControllers.cargarImagenUnicaUsuarioPost);

//traer la foto de cloudinary
router.get('/fotoUsuario/:id',[
    validarJWR,
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.traerImagenUnicaUsuario);

//exportar la instancia cuando sea requerida o invocada
export default router