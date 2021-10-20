//solicitar la dependecia de mongoose para operar en la base de datos desde el codidgo
import mongoose from 'mongoose';

//crear conexion con la base de datos
const dbConnection = async () =>{
    
    //si se establece la conexion con la base de datos
    try {
        await mongoose.connect(process.env.MONGODB_CNX, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex : true,
            useFindAndModify:false
        });
        console.log('conectado a la base de datos');
    }
    //si no se establece la conexion con la base de datos
     catch (error) {
        throw new Error('error al conectarse con la base de datos')
    }
}

export default dbConnection