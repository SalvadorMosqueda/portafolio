import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"


//traemos los proyectos del usuario que haya iniciado sesion
const obtenerProyectos = async(req,res)=>{
    //hacemos la biusqueda de todos los proyectos donde el usuario sea el colaborador o el creador
    //traete todo menos tareas
    const proyectos = await Proyecto.find({$or: [{colaboradores: {$in: req.usuario}},
    {creador: { $in: req.usuario}} ],}).select("-tareas")
    console.log(req.usuario)
    res.json(proyectos)
}


const nuevoProyectos = async(req,res)=>{
  //instanciamos el modelo proyecto con la informacion del body
  const proyecto  = new  Proyecto(req.body)
  //le decimos que en el espacio de creador guarde el id que obtuvimos del usuario que inicio sesion
  proyecto.creador = req.usuario._id;
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
    //buscamos el proyecto por id 
    try {
        //populate permite llenar campos con info de otra coleccion 
        //en proyectos guardamos el id de las tareas relacionados con pupulate traeremos toda la inf 
        //especificamos donde esta la relacion asi nos regresa todos los datos del arreglo de tareas en proyectos
        //como solo quremos traernos email y nombre, no podemos usar select por que hace 2 consultas, entonces
        //usamos la coma y ponemos lo  que queremos traer
        //le decimos que le aplicarmos populate a tareas y despues a completado un populate al resultado del populate
        const proyecto = await Proyecto.findById(id.trim()).populate({path: 'tareas',populate:{path:'completado',select:'nombre'}}).populate('colaboradores',"nombre email")

        if(!proyecto){
            //usamos Error para que en el front end si hay una error caemos en el catch y podemos
            //mandar una alerta con ese error directamente sin tener que comprobar nada
            const error = new Error("No encontrado")
            return res.status(404).json({msg:error.message})
        }
        //comparamos si es diferente para saber si  el que quiere acceder es el que creo el proyecto
        //tiene que no ser creador ni colaborador para que se cumpla
        if(proyecto.creador.toString()!==req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador=>colaborador._id.toString()===req.usuario._id.toString())){
            const error = new Error("Accion no valida")
            return res.status(404).json({msg:error.message})
        }
        
    //tienes que ser el creador o colaborador para obtener las tareas del proyecto 
    // busca todas las tareas donde el proyecto sea igual al id que le pasamos en este caso le pasamos el id del
    //proyecto
    //const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
    //aqui mismo retonamos el proyecto,y sus tareas enalazadas

    //si en el res retornamos asi ({proyect0}) en el front para acceder se repetira proyecto proyecto
    res.json(proyecto)
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

const BuscarColaborador = async(req,res)=>{
    const {email}=req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -updatedAt -password -token -__V ')
    
    if(!usuario){
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({msg: error.message})

    }
   res.json(usuario)

}
const agregarColaborador = async(req,res)=>{
    const proyecto = await Proyecto.findById(req.params.id)
    //confirmamos si existe el proyecto
    if(!proyecto){
        const error = new Error('Proyecto No Encontrado')
        return res.status(404).json({msg:error.message});
    }
    //la persona que quiere agregar otro colaborador sea el que lo creo
    //se compara la info del login con la info del creador del proyecto
    if(proyecto.creador.toString()!== req.usuario.id.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({msg:error.message});
    }
    //el colaborador no es el administrador del proyecto
    const {email}=req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -updatedAt -password -token -__V ')
    if(!usuario){
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({msg: error.message}) 
     }
     
    if(proyecto.creador.toString()===usuario._id.toString()){
        const error = new Error("El creador del proyecto no puede ser colaborador ")
        return res.status(404).json({msg: error.message}) 
    }
    //revizar que no este agregado ya 
    //revisa en el arreglo de colaboradoes si esta algun id ahi si es asi es que ya esta agregado
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error("El Usuario ya pertenece al proyecto")
        return res.status(404).json({msg: error.message}) 
    }
    //se puede agregar
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save(
        res.json({msg:'Colaborador Agregado Correctamente'})
    )   
}



const eliminarColaborador = async(req,res)=>{
    const proyecto = await Proyecto.findById(req.params.id)
    //confirmamos si existe el proyecto
    if(!proyecto){
        const error = new Error('Proyecto No Encontrado')
        return res.status(404).json({msg:error.message});
    }
    //la persona que quiere agregar otro colaborador sea el que lo creo
    //se compara la info del login con la info del creador del proyecto
    if(proyecto.creador.toString()!== req.usuario.id.toString()){
        const error = new Error('Accion no valida')
        return res.status(404).json({msg:error.message});
    }
    //se puede eliminar    usamos pull para sacar un elemento de un arreglo
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save(
        res.json({msg:'Colaborador Eliminado Correctamente'})
    )   
}

export {
    obtenerProyectos,
    nuevoProyectos,
    obtenerProyecto,
    editarProyecto,
    eliminarProyectos,
    agregarColaborador,
    eliminarColaborador,
    BuscarColaborador
    
}