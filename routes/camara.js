// solicitar dependencia y script a utilizar
import {Router} from 'express';
import controllerCamara from '../controllers/camara.js';

// Crear instancia de redireccionamiento
const router = Router();

// Agregar foto
router.post('/uploadfoto', controllerCamara);

//exportar la instancia cuando sea requerida o invocada
export default router;