import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim:true,
        require:true,

    },
    descripcion:{
        type:String,
        trim:true,
        require:true
    },
    fechaEntrega:{
        type:Date,
        default:Date.now(),

    },
    creador:{
        //hacemos referian para obentener el id de otra tabla
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    cliente:{
        type:String,
        trim:true,
        require:true
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea",
        },
    ],
    colaboradores:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Usuario"
        }
    ],
},
    {
        timestamps:true
    }
)

const Proyecto = mongoose.model('Proyecto',proyectosSchema)

export default Proyecto;