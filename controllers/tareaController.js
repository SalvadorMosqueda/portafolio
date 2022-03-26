import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";
const agregarTarea = async (req,res)=>{

    const {proyecto} = req.body;
    //aqui se queda el obejto en memoria de todo el proyecto
    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){
        const error = new Error('El proyecto no existe')
        return res.status(404).json({msg:error.message})

    }
    if(existeProyecto.creador.toString()!== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos para agregar tareas')
        return res.status(404).json({msg:error.message})

    }
    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        //almacenamos el id en el proyecto utilizamos la consulta con el objeto en memoria
        //usamos push para agregar al ultimo en react jamas se usa , node si 
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
         res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }    

}
const obtenerTarea = async (req,res)=>{
    const {id}=req.params
    //comprobamos la tarea
    //me trae el proyecto al que esta relacionado el populate
    const tarea = await Tarea.findById(id.trim()).populate('proyecto')
    if(!tarea){
    const error = new Error('Tarea no Encontrada')
    return res.status(404).json({msg:error.message})   
    }

    if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()){
    const error = new Error('No tienes los permisos para agregar tareas')
    return res.status(403).json({msg:error.message})   
    }
    res.json({tarea})
}
const actualizarTarea = async (req,res)=>{
    const {id}=req.params
    //comprobamos la tarea
    //me trae el proyecto al que esta relacionado el populate
    const tarea = await Tarea.findById(id.trim()).populate('proyecto')
    if(!tarea){
    const error = new Error('Tarea no Encontrada')
    return res.status(404).json({msg:error.message})   
    }

    if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()){
    const error = new Error('No tienes los permisos para agregar tareas')
    return res.status(403).json({msg:error.message})   
    }
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}
const eliminarTarea = async (req,res)=>{
    const {id}=req.params
    //comprobamos la tarea
    //me trae el proyecto al que esta relacionado el populate
    const tarea = await Tarea.findById(id.trim()).populate('proyecto')
    if(!tarea){
    const error = new Error('Tarea no Encontrada')
    return res.status(404).json({msg:error.message})   
    }

    if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()){
    const error = new Error('No tienes los permisos para agregar tareas')
    return res.status(403).json({msg:error.message})   
    }
    try {
        //la eliminanos tambien del arreglo de tareas en proyecto
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
            //espera a que se cumplan las 2 
        await Promise.allSettled([await proyecto.save(),await tarea.deleteOne()]) 
        res.json({msg:'La tarea se elimino'})
    } catch (error) {
        console.log(error)
    }
}
const cambiarEstado = async (req,res)=>{
    const {id}=req.params
    //comprobamos la tarea
    //me trae el proyecto al que esta relacionado el populate
    const tarea = await Tarea.findById(id.trim()).populate('proyecto')
    if(!tarea){
    const error = new Error('Tarea no Encontrada')
    return res.status(404).json({msg:error.message})
}
    //revisarque sea el creador o el colaborador 
    if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()&& !tarea.proyecto.colaboradores.some(colaborador=>colaborador._id.toString()===req.usuario._id.toString() )){
        const error = new Error('No tienes los permisos para agregar tareas')
        return res.status(403).json({msg:error.message}) 
    }
    //si esta como true pasa a false y al revez
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    await tarea.save();
    //retornamos la tarea con todo  y el populate para saber quien fue el ultimo que la edito
    const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado')
    res.json(tareaAlmacenada);

}
export{
    agregarTarea,
    eliminarTarea,
    actualizarTarea,
    cambiarEstado,
    obtenerTarea
}

