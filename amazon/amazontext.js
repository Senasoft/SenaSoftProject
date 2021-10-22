

import textractScan from './textractUtils.js';
import * as fs from 'fs'

const validarFormulario = async(direccionesLocales)=>{

    console.log("------------------");
    console.log(direccionesLocales);
    console.log("------------------");
    var infoFotos = [];

    return new Promise(async(resolve,reject)=>{
        console.log("------------- direcciones locales--------------");
        console.log(direccionesLocales);
        console.log("------------- direcciones locales--------------");


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