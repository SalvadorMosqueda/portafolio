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
 const servidor = app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})

//como queremos hacer en tiempo real el servidor lo pasabamos como parametro aqui
// socket io 
 import {Server} from 'socket.io'
 const io = new Server(servidor,{
     pingTimeout:60000,
     cors:{
         origin: process.env.FRONDTEND_URL,

     },
 })

 //abrimos la conexion de socket
  io.on('connection',(socket)=>{
      console.log('conectado a socekt')
      //definimos los eventos de socket io
      //con on  recibimos la funcion le decimos que tomaremos un proyecto
      socket.on('abrir proyecto',(proyecto)=>{
          //creamos una sala para meter al usuario
          socket.join(proyecto);

      });
      //estamos a que ocurra  
      socket.on('nueva tarea',tarea=>{
          
        //pasamos el proyecto para consumirlo en el statec
        const proyecto = tarea.proyecto;
        //con esta linea este evento solo se emite ala persona que tenga abierta ese proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
      
      })

  })