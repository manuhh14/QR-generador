const mongoose = require('mongoose');

const conexion = async()=>{

    try{
     await mongoose.connect("mongodb://localhost:27018/qrcode")

     console.log("Conectado a la base de datos qrcode !!")
    }catch(error){
        console.log(error)
        throw new Error("No se pudo conectar a las base de datos")
    }
}

module.exports={
    conexion
}

