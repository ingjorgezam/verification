const saveRecord = async (nameDevice, newState)=>{

    let recordDate = new Date()
    let fecha = recordDate.getDate() + '_' +  recordDate.getMonth() + 1 + '_' + recordDate.getFullYear() + " " 
                + recordDate.toLocaleTimeString()

    const contentFile = fecha + " " + nameDevice + " " + newState + "\n"

    fs.appendFile('recordsPlugins.txt',contentFile, (error)=>{
        if (error){
            console.log(`Error: ${error}`)
        }
    })
}