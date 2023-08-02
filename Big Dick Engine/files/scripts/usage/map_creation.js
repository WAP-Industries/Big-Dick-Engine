function Add_Map(){
    properties_container.style.display = "block"

    for (var field of System.map_fields){
        var box = document.createElement("input")
        box.style = "position: absolute; background: white; border: 2px solid black; border-radius: 5px;font-size: 25"
        box.margin = 20
        box.style.width = parseInt(properties_container.style.width, 10)-box.margin*2
        box.style.height = parseInt(properties_container.style.height, 10)/20
        box.style.left = box.margin
        box.style.top = box.margin+parseInt(header.style.top, 10)+parseInt(header.style.height, 10)+System.map_fields.indexOf(field)*parseInt(box.style.height, 10)+System.map_fields.indexOf(field)*box.margin

        box.placeholder = field
        box.ref_prop = field
        properties_container.appendChild(box)
    }

    properties_container.style.overflowY = "auto"

    // cancel btn
    const exit_btn = document.createElement("div")
    exit_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/exit_button.png'); background-size: 100% 100%"
    exit_btn.style.width = exit_btn.style.height = parseInt(editor.style.width, 10)/7
    exit_btn.margin = 10
    exit_btn.style.left = parseInt(editor.style.width, 10)-parseInt(exit_btn.style.width, 10)-exit_btn.margin*2
    exit_btn.style.top = parseInt(header.style.top, 10)
    exit_btn.setAttribute("class", "button")
    exit_btn.onclick = ()=>{Hide_Properties()}
    properties_container.appendChild(exit_btn)

    // submit button
    var submit_btn = document.createElement("div")
    submit_btn.style = "position: absolute; margin: auto; border: 2px solid black; border-radius: 10px; color: black; text-align: center; background: white; user-select: none"
    submit_btn.setAttribute("class", "button")
    submit_btn.innerHTML = "Confirm"
    submit_btn.margin = 10
    submit_btn.style.width = parseInt(properties_container.style.width, 10)-submit_btn.margin*4
    submit_btn.style.fontSize = submit_btn.style.height = parseInt(properties_container.style.height, 10)/15
    submit_btn.style.left = parseInt(properties_container.style.width, 10)/2-parseInt(submit_btn.style.width, 10)/2
    submit_btn.style.top = parseInt(box.style.top, 10)+parseInt(box.style.height, 10)+submit_btn.margin*2
    properties_container.appendChild(submit_btn)

    submit_btn.onclick = ()=>{
        var obj = {}
        for (var elem of [...properties_container.childNodes]){
            if (elem.ref_prop!=undefined) obj[elem.ref_prop] = +elem.value || elem.value
            if (elem.ref_prop=="Background" && elem.value=="") obj[elem.ref_prop] = 'grey'
        }
        obj["Map"] = []
        obj["RenderBackground"] = obj["Background"]

        System.Maps[obj["Name"]] = JSON.parse(JSON.stringify(obj))
        Make_Maps()
        Hide_Properties()

        var saved_map = System.Current_Map
        System.Current_Map = System.Maps[obj["Name"]]

        let refplayer = System.render_list.Character.filter(i=>i.isPlayer)[0].SavedObject
        var player = JSON.parse(JSON.stringify(refplayer))
        player.Image = refplayer.Image
        player.Map = Object.values(System.Maps).indexOf(System.Current_Map)
        player.ID = "player"
        Add_Component(
            player, 
            canvas.width/2-player.Width/2,
            canvas.height/2-player.Height/2
        )

        System.Current_Map = saved_map
    }
}


function Make_Maps(){
    [...map_container.childNodes].forEach((child)=>{
        if (child!=add_map_btn) map_container.removeChild(child)
    })

    for (var i=0;i<Object.keys(System.Maps).length;i++){
        var map_btn = document.createElement("div")
        map_btn.style = "position: absolute; margin: auto; border: 3px solid black; color: black; text-align: left; background: white; user-select: none"
        map_btn.margin = 20
        map_btn.style.width = parseInt(map_container.style.width, 10)-map_btn.margin*2
        map_btn.style.height = parseInt(map_container.style.height, 10)/15
        map_btn.style.fontSize = parseInt(map_container.style.height, 10)/20
        map_btn.style.left = parseInt(map_container.style.width, 10)/2-parseInt(map_btn.style.width, 10)/2-map_btn.margin/4
        map_btn.style.top = parseInt(add_map_btn.style.top, 10)+parseInt(add_map_btn.style.height, 10)+i*map_btn.margin*2+map_btn.margin
        map_btn.innerHTML = "&nbsp;"+Object.keys(System.Maps)[i]
        map_btn.name = Object.keys(System.Maps)[i]
        map_btn.setAttribute("class", "button")
        map_btn.clicked = false
        map_btn.type = "map"

        if (System.Current_Map?.Name==Object.keys(System.Maps)[i]) {
            map_btn.style.opacity = 0.5
            Set_Image(map_editor, System.Current_Map.Background)
        }

        map_btn.onclick = ()=>{
            [...map_container.childNodes].forEach((child)=>{
                if (child.type=="map" && child!=event.srcElement) child.style.opacity = 1
            })
            Hide_Map()
            System.Current_Map = System.Maps[event.srcElement.name]
            Show_Map()
            event.srcElement.style.opacity = 0.5

            map_name.innerHTML = event.srcElement.name
            Set_Image(map_editor, System.Current_Map.Background)
        }
        map_container.appendChild(map_btn)
    }
    map_container.style.overflowY = map_container.scrollHeight>map_container.clientHeight ? "scroll":"none"
}

function Show_Map(){
    for (var elem of System.Current_Map["Map"])
        map_editor.insertBefore(elem, hl_box)
}


function Hide_Map(){
    Reset_Comps()
    System.Current_Map["Map"].forEach((child)=>{map_editor.removeChild(child)})
}