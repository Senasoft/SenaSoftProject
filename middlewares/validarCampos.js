//importa dependencias a usar
import { validationResult } from "express-validator";

const validarCampo = (req, res, next) =>{
    //capturar erroes en el array
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
}

//exportar captura de errores en validaciones
export {validarCampo}