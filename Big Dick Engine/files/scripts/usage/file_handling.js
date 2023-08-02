function ConvertData(){
    let contents = ""

    let title_data = JSON.stringify(System.title_screen)
    let map_data = JSON.stringify(System.Maps)
    let component_data = function(){
        let dic = {}
        
        for (let type_list in System.render_list){
            dic[type_list] = []
            for (let obj of System.render_list[type_list]){
                let _obj = JSON.parse(JSON.stringify(obj))
                _obj.X = obj.SavedObject.X, _obj.Y = obj.SavedObject.Y
                _obj.WanderOrigin = obj.SavedObject.WanderOrigin
                dic[type_list].push(_obj)
            }
        }
        return JSON.stringify(dic)
    }()

    let sep = '8==========D'
    contents+=`${sep}NAME_DATA`+JSON.stringify(System.project_name)
    contents+=`${sep}TITLE_DATA`+title_data
    contents+=`${sep}MAP_DATA`+map_data
    contents+=`${sep}COMPONENT_DATA`+component_data
    contents+=`${sep}SLOT_DATA`+JSON.stringify(System.slots)

    return contents
}


function ParseData(unparsed_data){
    let data = unparsed_data.split("8==========D");

    [System.project_name, System.title_screen, System.Maps, System.render_list, System.slots] = function(){
        let arr = []
        for (let name of ["NAME_DATA", "TITLE_DATA", "MAP_DATA", "COMPONENT_DATA", "SLOT_DATA"]){
            arr.push(data.filter(i=>i.includes(name))[0].replace(name, ""))
        }
        return arr.map(i=>JSON.parse(i))
    }()
    System.Player = System.render_list.Character.filter(i=>i.isPlayer)[0]
    document.body.appendChild(container)
}


function SaveGame(){
    let file = new Blob([ConvertData()], {type: "text/plain;charset=utf-8"});
    saveAs(file, `${System.project_name}.BIGDICKENGINE`)
}


function LoadGame(file){
    let reader = new FileReader()
    reader.readAsText(...file)
    reader.onload = ()=>{
        ParseData(reader.result)
        Array(dialogue_box, dialogue_char, dialogue_name).forEach(elem=>{elem.style.display = "none";elem.style.opacity=1})
        CreateTitleScreen()
    }
}

function CreateNewProject(projectname){
    CreateProject(projectname) 
    Install_Default()
}


function LoadProject(file){
    let reader = new FileReader()
    reader.readAsText(...file)
    reader.onload = ()=>{
        ParseData(reader.result)
        CreateProject(System.project_name)
            
        System.Current_Map = System.Maps[Object.keys(System.Maps)[0]]
        System.Current_Map.Map = []
        Make_Slots()
        Make_Maps()
        map_container.childNodes[1].click()

        for (let map of Object.keys(System.Maps).reverse()){
            System.Current_Map = System.Maps[map]
            System.Current_Map.Map = []
            for (let type in System.render_list){
                System.render_list[type]
                    .filter(obj=>Object.values(System.Maps).indexOf(System.Current_Map)==obj.Map)
                    .forEach(obj=>{
                        System.render_list[type].splice(System.render_list[type].indexOf(obj), 1)
                        Add_Component(obj, obj.X, obj.Y)
                    })
            }
        }
        [...map_editor.childNodes]
            .filter(i=>i.object && i.object.Map!=Object.values(System.Maps).indexOf(System.Current_Map))
            .forEach(elem=>map_editor.removeChild(elem))
    }
}