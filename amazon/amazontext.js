

import textractScan from './textractUtils.js';
import * as fs from 'fs'

const validarFormulario = async(direccionesLocales)=>{

    console.log("---------direcciones locales de fotos temporal---------");
    console.log(direccionesLocales);
    console.log("-------direcciones locales de fotos temporal-----------");
    var infoFotos = [];

    return new Promise(async(resolve,reject)=>{


        for(var direccion of direccionesLocales){ 
            var data = fs.readFileSync(direccion);
            var result = await textractScan(data);
            if(result.length ===0){
                return reject(false)
            }
            infoFotos.push(result);
        }
        
        return resolve(infoFotos)
    
    })
    
    
}




export {
    validarFormulario
}