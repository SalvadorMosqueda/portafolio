import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"
import Tarea from "../models/Tarea.js"

//traemos los proyectos del usuario que haya iniciado sesion
const obtenerProyectos = async(req,res)=>{
    //tramos el proyecto donde creador sea igual a usario que esta en req
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
    console.log(req.usuario)
    res.json(proyectos)
}


const nuevoProyectos = async(req,res)=>{
  //instanciamos el modelo proyecto con la informacion del body
  const proyecto  = new  Proyecto(req.body)
  //le decimos que en el espacio de creador guarde el id que obtuvimos del usuario que inicio sesion
  proyecto.creador = req.usuario._id;

  console.log(req.usuario)
  try {
      const proyectoAlmacenado = await proyecto.save()
      res.json(proyectoAlmacenado)

  } catch (error) {
      console.log(error)
  }
}

const obtenerProyecto = async(req,res)=>{
    //tomamos el id del parametro
    const {id}= req.params;
    console.log(id)
    //buscamos el proyecto por id 
    try {
        const proyecto = await Proyecto.findById(id.trim())

        if(!proyecto){
            //usamos Error para que en el front end si hay una error caemos en el catch y podemos
            //mandar una alerta con ese error directamente sin tener que comprobar nada
            const error = new Error("No encontrado")
            return res.status(404).json({msg:error.message})
        }
        //comparamos si es diferente para saber si  el que quiere acceder es el que creo el proyecto
        if(proyecto.creador.toString()!==req.usuario._id.toString()){
        
            const error = new Error("Accion no valida")
            return res.status(404).json({msg:error.message})
        }
        
    //tienes que ser el creador o colaborador para obtener las tareas del proyecto 
    // busca todas las tareas donde el proyecto sea igual al id que le pasamos en este caso le pasamos el id del
    //proyecto
    const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
    //aqui mismo retonamos el proyecto,y sus tareas enalazadas
    res.json({proyecto,tareas})
    } catch (error) {
        console.log(error)
        return res.status(404).json({msg:'error en el id'})
    }
}

const editarProyecto = async(req,res)=>{
     //tomamos el id del parametro
     const {id}= req.params;
     console.log(id)
     try {
         const proyecto = await Proyecto.findById(id.trim())
 
         if(!proyecto){
             const error = new Error("No encontrado")
             return res.status(404).json({msg:error.message})
         }
         if(proyecto.creador.toString()!==req.usuario._id.toString()){
         
             const error = new Error("Accion no valida")
             return res.status(404).json({msg:error.message})
         }
         //paso las pruebas
         //asignale el proyecto en nombre lo que hay en el body, si no hay nada deja lo que ya esta ahi
         proyecto.nombre = req.body.nombre || proyecto.nombre
         proyecto.descripcion = req.body.descripcion || proyecto.descripcion
         proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
         proyecto.cliente = req.body.cliente || proyecto.cliente

         try {
             const proyectoAlmacenado = await proyecto.save()
             res.json(proyectoAlmacenado)
         } catch (error) {
             console.log(error)
         }

     } catch (err) {
         console.log(err)
         const error = new Error("Error en el id")
         return res.status(404).json({msg:error.message})
     }
}

const eliminarProyectos = async(req,res)=>{

     //tomamos el id del parametro
     const {id}= req.params;
     console.log(id)
     //buscamos el proyecto por id 
     try {
         const proyecto = await Proyecto.findById(id.trim())
 
         if(!proyecto){
             //usamos Error para que en el front end si hay una error caemos en el catch y podemos
             //mandar una alerta con ese error directamente sin tener que comprobar nada
             const error = new Error("No encontrado")
             return res.status(404).json({msg:error.message})
         }
         //comparamos si es diferente para saber si  el que quiere acceder es el que creo el proyecto
         if(proyecto.creador.toString()!==req.usuario._id.toString()){
         
             const error = new Error("Accion no valida")
             return res.status(404).json({msg:error.message})
         }
        //paso las validaciones 
        try {
            await proyecto.deleteOne()
            res.json({msg:'proyecto eliminado'})
            console.log('error')

        } catch (error) {
            console.log(error)
        }
     } catch (error) {
         console.log(error)
         return res.status(404).json({msg:'error en el id'})
     }
    
 
 
    
}

const agregarColaborador = async(req,res)=>{
    
}

const eliminarColaborador = async(req,res)=>{
    
}

export {
    obtenerProyectos,
    nuevoProyectos,
    obtenerProyecto,
    editarProyecto,
    eliminarProyectos,
    agregarColaborador,
    eliminarColaborador,
    
}