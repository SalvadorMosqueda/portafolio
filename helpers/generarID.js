const generarID  =()=>{
    //con substring quitamos los 2 primeros carateres
    const random =Math.random().toString(32).substring(2)
    const fecha=  Date.now().toString(32)
    return random+fecha;
}

export default generarID