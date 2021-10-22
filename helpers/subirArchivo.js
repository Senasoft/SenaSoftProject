// crear nombres unicos  dondeTodoSePerdio
import {v4 as uuidv4 } from 'uuid';

// trabajar rutas en el servidor
import path from 'path';
import url from 'url';

const subirArchivo=(archivo,extensionesValidas=['png','PNG','jpg','jpeg','gif'])=>{
    //la libreria trabaja con promesas
    return new Promise((resolve,reject)=>{

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        //verificar si la extension es valida
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, solo ${extensionesValidas}`)
        }

        //nombre unico + la extension
        const nombreTemp = uuidv4()+"."+extension;

        //extrae la carpeta de donde esta instalado
        const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
        
        //ruta donde voy a subir
        const uploadPath = path.join(__dirname,'../uploads/',nombreTemp);

        //mover el archivo a esa carpeta
        archivo.mv(uploadPath,(err)=>{
            if(err){
                return reject(err)
            }
            return resolve(uploadPath);

        })
        
    })
}


export{
    subirArchivo
}