function Add_Slot(type){
    Release_Slot()
    for (var func in System.funcs){
        if (func==type) Show_Properties(System.funcs[func], func, false)
    }
}

function Release_Slot(){
    [...selector_container.childNodes].forEach((child)=>{child.clicked = false; child.style.opacity = 1})
    System.grabbed_slot = null
}

function Show_Properties(fields, type, isPlayer=false){
    properties_container.style.display = "block"

    var component
    for (var _class of System.classes){
        if (_class.id==type) component = new _class({})
    }

    let text_fields = fields.filter(i=>i[1]!="checkbox")
    let box_fields = fields.filter(i=>i[1]=="checkbox")

    var margin = 20
    for (var field of text_fields){
        var box = document.createElement("input")
        box.style = "position: absolute; background: white; border: 2px solid black; border-radius: 5px;font-size: 25"
        box.margin = margin
        box.style.width = parseInt(properties_container.style.width, 10)-box.margin*2
        box.style.height = parseInt(properties_container.style.height, 10)/20

        box.style.left = box.margin
        box.style.top = box.margin+parseInt(header.style.top, 10)+parseInt(header.style.height, 10)+text_fields.indexOf(field)*parseInt(box.style.height, 10)+text_fields.indexOf(field)*box.margin

        box.placeholder = field[0]
        box.split = field[1]
        box.num = field[1]=="number"
        if (field[0]=="Name")
            box.oninput = ()=>{
                for (let char of event.srcElement.value){
                    if (!/[a-z0-9, ]/i.exec(char))
                        event.srcElement.value = event.srcElement.value.replace(char, "")
                }
           }

        box.ref_prop = field[0]
        properties_container.appendChild(box)
    }

    for (let field of box_fields){
        var c = document.createElement("div")
        c.style = "position: absolute; margin: auto;"
        c.style.left = margin; 
        c.style.top = parseInt(box.style.top, 10)+parseInt(box.style.height, 10)+box.margin*2*box_fields.indexOf(field)+box.margin
        c.style.fontSize = c.style.height = parseInt(properties_container.style.height, 10)/25
        c.style.width = parseInt(properties_container.style.width, 10)-margin*2
        c.innerHTML = `${field[0]}&nbsp;`
        c.id = "checkbox"

        let c_switch = document.createElement("input")
        c_switch.style = "position: absolute; margin: auto;"
        c_switch.style.width = c_switch.style.height = parseInt(c.style.height, 10)
        c_switch.type = "checkbox"
        c_switch.checked = field[0]=="Visible"
        c.appendChild(c_switch); properties_container.appendChild(c)    
    }


    //dialogue input
    if (type=="Character" && !isPlayer) {
        var t = document.createElement("textarea")
        t.style = "position: absolute; margin: auto;"
        t.style.width = parseInt(properties_container.style.width, 10)-box.margin*2
        t.style.height = parseInt(properties_container.style.height, 10)/2
        t.style.fontSize = 25
        t.style.left = margin
        t.style.top = margin+parseInt(c.style.top,10)+parseInt(c.style.height, 10)

        var c = t
        properties_container.appendChild(c)
        t.ref_prop = t.placeholder = "Interaction"
        t.interaction = true
    }


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
    submit_btn.style.left = submit_btn.margin
    submit_btn.style.top = parseInt(c.style.top, 10)+parseInt(c.style.height, 10)+submit_btn.margin*2

    submit_btn.onclick = ()=>{
        let thumbnail
        for (var elem of [...properties_container.childNodes]){
            if (elem.value!=undefined) component[elem.ref_prop] = ((+elem.value).toString()!="NaN" &&  elem.value!="") ? +elem.value:elem.value
            if (elem.interaction) {
                if (!Debugger.Debug(Parser.Parse(elem.value))) return
                component[elem.ref_prop] = {unparsed: elem.value, parsed: Parser.Parse(elem.value), variables: {}}
            }

            if (elem.split==true){
                component[elem.ref_prop] = component[elem.ref_prop].split(",")
                component[elem.ref_prop] = component[elem.ref_prop].map((string)=>string.replace(" ", ""))

                thumbnail = component[elem.ref_prop][0]
            }
        }

        if (component.id=="Character") {
            component.Image = component[Object.keys(component).filter(i=>i.includes("Idle")).filter(i=>component[i].length>0 && component[i][0]!="")[0]]
            thumbnail = component.Image[0]
        }
        if (component.id=="Tile") component.Width = component.Height = System.Current_Map.Scale;

        [...properties_container.childNodes]
            .filter(i=>i.id=="checkbox")
            .forEach(i=>component[Parser.StripSpace(i.childNodes[0].textContent)] = i.childNodes[1].checked)
        
        System.slots[type].push({"image": thumbnail, "object": component})

        Hide_Properties();
        Make_Slots()
    }
    properties_container.appendChild(submit_btn)

    properties_container.style.overflowY = properties_container.scrollHeight>properties_container.clientHeight ? "scroll":"auto"
    properties_container.scrollTo(0,0)

    return component
}

function Hide_Properties(){
    [...properties_container.childNodes].forEach((child)=>{if (child!=header) properties_container.removeChild(child)})
    properties_container.style.display = "none"
}

function Edit_Properties(object, comp_div){
    var component = Show_Properties(System.funcs[object.id], object.id, object.isPlayer)
    if (object.isPlayer) component.isPlayer = true
    if (object.id=="Tile") component.Width = component.Height = System.Current_Map.Scale

    for (var elem of [...properties_container.childNodes]){
        if (elem.ref_prop!=undefined) elem.value = object[elem.ref_prop]
        if (elem.ref_prop=="Interaction") elem.value = object[elem.ref_prop].unparsed
    }
    
    [...properties_container.childNodes]
        .filter(i=>i.id=="checkbox")
        .forEach(i=>i.childNodes[1].checked = object[Parser.StripSpace(i.childNodes[0].textContent)])


    properties_container.childNodes[properties_container.childNodes.length-1].onclick = ()=>{
        let thumbnail
        for (var elem of [...properties_container.childNodes]){
            if (elem.value!=undefined) component[elem.ref_prop] = ((+elem.value).toString()!="NaN" &&  elem.value!="") ? +elem.value:elem.value
            if (elem.interaction) {
                if (!Debugger.Debug(Parser.Parse(elem.value))) return
                component[elem.ref_prop] = {unparsed: elem.value, parsed: Parser.Parse(elem.value), variables: {}}
            }
            
            if (elem.split){
                component[elem.ref_prop] = component[elem.ref_prop].split(",")
                component[elem.ref_prop] = component[elem.ref_prop].map((string)=>string.replace(" ", ""))
            }
        }

        component.Map = object.Map
        
        if (component.id=="Character") {
            component.Image = component[Object.keys(component).filter(i=>i.includes("Idle")).filter(i=>component[i].filter(i=>i!="").length>0)[0]]
            thumbnail = component.Image[0]
        }
        [...properties_container.childNodes]
            .filter(i=>i.id=="checkbox")
            .forEach(i=>component[Parser.StripSpace(i.childNodes[0].textContent)] = i.childNodes[1].checked)


        // component.Position = component.isPlayer ? {x: canvas.width/2-component.Width/2, y: canvas.height/2-component.Height/2}:object.SavedObject.Position
        component.X = component.isPlayer ? canvas.width/2-component.Width/2:object.SavedObject.X
        component.Y = component.isPlayer ? canvas.height/2-component.Height/2:object.SavedObject.Y
        component.WanderOrigin = {x: object.SavedObject.X, y: object.SavedObject.Y}
        component.SavedObject = JSON.parse(JSON.stringify(component))

        comp_div.style = "position: absolute; margin: auto;"
        comp_div.style.width = component.Width, comp_div.style.height = component.Height
        Set_Image(comp_div, component.Image[component.ImgIndex])
        comp_div.style.left = component.X-System.offset.x, comp_div.style.top = component.Y-System.offset.y
        comp_div.object = component
        
        if (component.isPlayer){
            const saved_map = System.Current_Map
            for (let map in System.Maps){
                System.Current_Map = System.Maps[map]
                if (System.Current_Map==saved_map) continue

                let new_player = JSON.parse(JSON.stringify(component))
                new_player.Map = Object.values(System.Maps).indexOf(System.Current_Map)

                Edit_Component(System.Current_Map.Map.filter(i=>i.object.isPlayer)[0].object, new_player, "Character")
                let comp_obj = System.Current_Map.Map.filter(i=>i.object.isPlayer)[0]
                System.Current_Map.Map[System.Current_Map.Map.indexOf(comp_obj)] = comp_div
            }
            System.Current_Map = saved_map
        }
        Edit_Component(object, component, component.id)

        Hide_Properties();
    }
}


var Empty_Slots = ()=>[...selector_container.childNodes].forEach((slot)=>{if (slot!=add_btn) selector_container.removeChild(slot)})

function Make_Slots(){
    Empty_Slots()

    var margin = 10

    var offset = parseInt(add_btn.style.top, 10)+parseInt(add_btn.style.height, 10)
    var width = parseInt(selector_container.style.width, 10)/3-margin*2

    var posx = 0
    var posy = 0

    for (var i=1;i<System.slots[System.current_component].length+1;i++){
        var slot = document.createElement("div")
        slot.style = "position: absolute; margin: auto; border: 2px solid black; border-radius: 10px; background: white"
        slot.style.width = slot.style.height = width
        slot.style.top = posy*width+offset+margin*(posy+1)
        slot.style.left = posx*width+margin*posx+margin
        Set_Image(slot, System.slots[System.current_component][i-1].image)
        slot.setAttribute("class", "button")
        slot.type = "slot"
        slot.clicked = false
        slot.object = System.slots[System.current_component][i-1].object


        slot.onclick = ()=>{

            if (System.Current_Map==null) return

            [...selector_container.childNodes].forEach((child)=>{
                if (child.type="slot" && child!=event.srcElement){
                    child.clicked = false; child.style.opacity = 1
                }
            })

            if (event.srcElement.object.id=="Tile") event.srcElement.object.Width = event.srcElement.object.Height = System.Current_Map.Scale

            event.srcElement.clicked = !event.srcElement.clicked
            event.srcElement.style.opacity = event.srcElement.clicked ? 0.7:1
            System.grabbed_slot = event.srcElement.clicked ? event.srcElement.object:null

            hl_box.style.width = event.srcElement.object.Width, hl_box.style.height = event.srcElement.object.Height
        }

        posx++

        if (i%3==0){
            posx = 0
            posy++
        }

        selector_container.appendChild(slot)
    }

}



function Add_Component(object, x, y){

    object.X = x+System.offset.x, object.Y = y+System.offset.y
    object.WanderOrigin = {x: x+System.offset.x, y: y+System.offset.y}
    object.Map = Object.values(System.Maps).indexOf(System.Current_Map)
    object.SavedObject = JSON.parse(JSON.stringify(object))

    for (var _class of System.classes){
        if (object.id==_class.id){
            System.render_list[System.components[System.classes.indexOf(_class)]].push(JSON.parse(JSON.stringify(object)))
            Save_Render_List()

            var comp_div = document.createElement("div")
            comp_div.style = "position: absolute; margin: auto;"
            comp_div.style.width = object.Width, comp_div.style.height = object.Height
            Set_Image(comp_div, object.Image[object.ImgIndex])
            comp_div.style.left = object.X-System.offset.x, comp_div.style.top = object.Y-System.offset.y
            comp_div.object = JSON.parse(JSON.stringify(object))

            comp_div.onclick = (e)=>{
                if (System.grabbed_slot!=null) return

                if (e.shiftKey){
                    if (event.srcElement.object.isPlayer) return
                    e.stopPropagation()
                    Delete_Component(event.srcElement.object, event.srcElement.object.id)
                    Save_Render_List()
                    map_editor.removeChild(event.srcElement)
                    return
                }

                e.stopPropagation(); 
                Hide_Properties()
                Edit_Properties(event.srcElement.object, event.srcElement)
            }

            if (object.id!="Character"){
                let div
                switch (object.id){
                    case "Tile":
                        div = Search_Component(["Character", "Sprite", "Door"])
                    break;
                    case "Sprite":
                        div = Search_Component(["Character", "Door"])
                    break;
                    case "Door":
                        div = Search_Component(["Character"])
                    break;
                }
                map_editor.insertBefore(comp_div, (div ?? hl_box))
            }
            else map_editor.insertBefore(comp_div, hl_box)

            System.Current_Map["Map"].splice([...map_editor.childNodes].indexOf(comp_div), 0, comp_div)
            break
        }
    }
}

const Save_Render_List = ()=>System.saved_render_list = JSON.stringify(System.render_list)