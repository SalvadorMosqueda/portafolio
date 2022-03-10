import Proyecto from "../models/Proyecto";

const Comprobar =  async id=>{
    let resultado
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
         resultado = 'Exitoso'
     } catch (error) {
         console.log(error)
         return res.status(404).json({msg:'error en el id'})
     }
    
 
     return resultado
}


export default Comprobar;