import axios from "axios"
import fs from "fs"

const test = (req,res)=>{
    res.json("1!")
}

const turnOnOffSwOutl = async (ipCont, deviceNum, stateDevice, deviceName) =>{
    const data_request =  "/data_request?id=action&DeviceNum="
    const serviceName = "&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue="
    const stateD = Number(stateDevice)


    try{
        const resultOp = await axios.get(
            `http://${ipCont}/port_3480${data_request}${deviceNum}${serviceName}${stateD}`
        );

        let stateName = Number(stateDevice)===0 ? " Apagado " : " Encendido "
        console.log(deviceName + " " + stateName)

    }catch (error) {
        //console.log(error)
        console.error({status: "Error al enviar comando de interruptores switches"})
    }
}

const turnOnOffAirC = async (ipCont, deviceNum, stateDevice, deviceNameAir) =>{
    const data_request =  "/data_request?id=action&DeviceNum="
    const serviceName = "&serviceId=urn:upnp-org:serviceId:HVAC_UserOperatingMode1&action=SetModeTarget&NewModeTarget="
    const stateD = Number(stateDevice)===0 ? 'Off' : 'CoolOn'
    try{

        const resultOp = await axios.get(
            `http://${ipCont}/port_3480${data_request}${deviceNum}${serviceName}${stateD}`
        );
        
        let stateName = Number(stateDevice)===0 ? " Apagado " : " Encendido "
        console.log(deviceNameAir + " " + stateD)


    }catch (error) {
        //console.log(error)
        console.error({status: "Error al enviar comando del aire acondicionado"})
    }
}

const getSData = async (req,res)=>{
    const {ip, idDispositivo, estadoDispositivos, repeatCommand} = req.params
    try {
      const user_data = await axios.get(
        `http://${ip}/port_3480/data_request?id=user_data`
      );

      const plugin = user_data.data.devices.find((device) => device.id == idDispositivo)
      const actuadores = plugin.states.find((states) => states.variable == "Actuadores On")
      const aires = plugin.states.find((states) => states.variable == "Aire")
      const tomasSwitches = actuadores.value.split(",")
      let aire = aires.value.split(",")

      //Recorrer el array para buscar los tomas y switches a endender a prender
        if ((actuadores.value != 0)  || (actuadores[0] !=0 )) {
            tomasSwitches.forEach(function (disp) {
                const actuador = user_data.data.devices.find((device) => device.id == disp) //Traer todas las variables del dispositivo

                if ( (actuador !==undefined ) && (actuador !==null) && (actuador !== NaN )){
                        const stateDisp = actuador.states.find((states) => states.variable == "Status")

                        switch (actuador.category_num){
                            case 3: //Sí es interruptor o tomacorriente
                                if (Number(stateDisp.value) != Number(estadoDispositivos)){
                                    const resultopera = turnOnOffSwOutl(ip, actuador.id, estadoDispositivos, actuador.name)
                                }
                                break
                        }
                    }
            });
        }

        if ((aires.value != 0)  || (aire[0] !=0 )) {
            aire.forEach(function (disp) {
                const aireaux = user_data.data.devices.find((device) => device.id == disp)
                
                if ( (aireaux !==undefined ) && (aireaux !==null) && (aireaux !== NaN )){
                        const stateDisp = aireaux.states.find((states) => states.variable == "ModeStatus")

                        switch (aireaux.category_num){
                            case 5: //Sí es Aire
                                let stateAir = Number(estadoDispositivos)===0 ? 'Off' : 'CoolOn'
                                
                                if (repeatCommand===1){
                                    const resultopera = turnOnOffAirC(ip, aireaux.id, estadoDispositivos,aireaux.name)
                                }else{
                                    if (stateDisp.value != stateAir){
                                        const resultopera = turnOnOffAirC(ip, aireaux.id, estadoDispositivos,aireaux.name)
                                    }
                                }
                                break
                        }
                    }
            });
        }

      res.json(actuadores);

    } catch (error) {
      //console.log(error)
      res.status(500).json({status: "Error"})
    }
}

export const methods = {
    test,
    getSData
}