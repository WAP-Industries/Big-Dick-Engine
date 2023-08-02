function Search_Component(types){
    return [...map_editor.childNodes].filter(child=>child!=hl_box || child==map_name).filter(child=>types.includes(child.object?.id))[0] ?? null
}

function Search_Player(){
    return System.render_list.Character.filter(char=>char.isPlayer && char.Map==System.Game_Map)[0]
}

function Search_Image(obj){
    return obj[Object.keys(obj).filter(i=>i.includes("Idle")).filter(i=>obj[i].filter(i=>i!="").length>0)[0]]
}

function Search_Char(name){
    return System.render_list.Character.filter(i=>i.Name==name)[0]
}


function Delete_Component(object, id){
    let resElem1 = System.render_list[id].filter(elem=>Compare_Object(elem, object))[0]
    if (resElem1) System.render_list[id].splice(System.render_list[id].indexOf(resElem1),1)

    let resElem2 = System.Current_Map.Map.filter(elem=>Compare_Object(elem.object, object))[0]
    if (resElem2) System.Current_Map.Map.splice(System.Current_Map.Map.indexOf(resElem2), 1)
}

function Edit_Component(old_obj, new_obj, id){
    let resElem = System.render_list[id].filter(elem=>Compare_Object(elem.SavedObject, old_obj))[0]
    if (resElem) System.render_list[id][System.render_list[id].indexOf(resElem)] = new_obj
    Save_Render_List()
}


function Search_Editor(obj){
    return [...map_editor.childNodes].filter(elem=>elem.object!=undefined && Compare_Object(elem.object, obj))[0] ?? null
}


function Compare_Object(obj1, obj2){
    let clone1=JSON.parse(JSON.stringify(obj1)), clone2=JSON.parse(JSON.stringify(obj2))
    let carr = [clone1, clone2]

    carr.forEach((clone)=>{
        for (let prop in clone){
            if (System.non_compare_props[clone.id].includes(prop))
                delete clone[prop]
            if (clone[prop]?.variables){
                for (let key in clone[prop].variables)
                    delete clone[prop].variables[key]?.reference
            }
        }
    })
    return JSON.stringify(clone1)==JSON.stringify(clone2)
}