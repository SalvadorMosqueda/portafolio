import  express  from "express";
import conectarDB from "./config/db.js";
import dotenv from 'dotenv'
import usuarioRoutes from './routes/UsuarioRoutes.js'
import proyectosRoutes from './routes/ProyectosRouter.js'
import tareaRoutes from './routes/TareaRouter.js'
import cors from 'cors'

const app =express();
//busco archivo .env
dotenv.config()

conectarDB();

//configuramos cors
const whithlist =[process.env.FRONDTEND_URL]
const corsOtions={
    origin: function(origin,callback){
        if(whithlist.includes(origin)){
            //puede consultar la api
            callback(null,true)
        }else{
            //no puede consultarla
            callback(new Error('Error de cors'))
        }
    }
}
app.use(cors(corsOtions));
//procesa la info tipo json
app.use(express.json())
//routing
//use responde a todos los vervos
app.use('/api/usuarios',usuarioRoutes)
app.use('/api/proyectos',proyectosRoutes)
app.use('/api/tareas',tareaRoutes)



//en produccion se inyecta solo esa vareable en caso que sea local asignale el 4000
const PORT = process.env.PORT ||4000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})