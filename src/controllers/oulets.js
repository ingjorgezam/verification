import axios from "axios"

const turnOnOffSwOutl = async (ipCont, deviceNum, stateDevice, deviceName) =>{
    const data_request =  "/data_request?id=action&DeviceNum="
    const serviceName = "&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue="
    const stateD = Number(stateDevice)

    try{
        const resultOp = await axios.get(
            `http://${ipCont}/port_3480${data_request}${deviceNum}${serviceName}${stateD}`
        );
        
        console.log(deviceName + " " + "Encendido por Horus Hotel")

    }catch (error) {
        console.log(error)
        console.error({status: "Error al enviar comando de interruptores switches"})
    }
}

const getSData = async (req,res)=>{
    const {ip, idDispositivo} = req.params
    try {
      const user_data = await axios.get(
        `http://${ip}/port_3480/data_request?id=user_data`
      );

      const plugin = user_data.data.devices.find((device) => device.id == idDispositivo)
      const actuadores = plugin.states.find((states) => states.variable == "Actuadores On")
      const tomasSwitches = actuadores.value.split(",")

      //Recorrer el array para buscar los tomas y switches a endender a prender
        if ((actuadores.value != 0)  || (actuadores[0] !=0 )) {
            tomasSwitches.forEach(function (disp) {
                    const actuador = user_data.data.devices.find((device) => device.id == disp) //Traer todas las variables del dispositivo
                    if ( (actuador !==undefined ) && (actuador !==null) && (actuador !== NaN )){
                        let nameDevice = actuador.name
                        nameDevice = nameDevice.trim()
                        
                        const stateDisp = actuador.states.find((states) => states.variable == "Status")

                        if (nameDevice.substr(0,4).toLowerCase()==='toma'){
                            switch (actuador.category_num){
                                case 3: //Sí es interruptor o tomacorriente
                                if (Number(stateDisp.value) === 0) {
                                        const resultopera = turnOnOffSwOutl(ip, actuador.id, 1, nameDevice)
                                }else{
                                    console.log("no encendió")
                                }
                            }
                        }
                    }
                
            });
        }

      res.json(actuadores);

    } catch (error) {
      console.log(error)
      res.status(500).json({status: "Error"})
    }
}


export const methods = {
    getSData
}