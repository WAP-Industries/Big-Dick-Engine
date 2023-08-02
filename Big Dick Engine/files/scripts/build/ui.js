// main container
const container = document.createElement("div")
container.style = "position: absolute; margin: auto; top:0; right:0; left:0; bottom:0;width: 1000; height: 700; background: white; border: 4px solid black"

// rendering canvas
const canvas = document.createElement("canvas")
canvas.style = "position: absolute; margin: auto;"; const context = canvas.getContext('2d')
canvas.style.width = canvas.width = parseInt(container.style.width, 10)-parseInt(container.style.border, 10)*2//*2/3-parseInt(container.style.border, 10)
canvas.style.height = canvas.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2
canvas.style.left = parseInt(container.style.width, 10)-canvas.width-parseInt(container.style.border, 10)*2


// map editor
const map_editor = document.createElement("div")
map_editor.style = "position: absolute; margin: auto; background: grey; overflow: hidden"
map_editor.style.width = parseInt(container.style.width, 10)*2/3-parseInt(container.style.border, 10)
map_editor.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2
map_editor.style.left = parseInt(container.style.width, 10)-parseInt(map_editor.style.width, 10)-parseInt(container.style.border, 10)*2


map_editor.onmousemove = (e)=>{
    if (System.grabbed_slot==null){
        hl_box.style.display = "none"
        return
    }
    hl_box.style.display = "block"
    let rect = map_editor.getBoundingClientRect()
    let x = e.pageX-rect.left
    let y = e.pageY-rect.top
    hl_box.style.left = System.grabbed_slot instanceof Tile ? Math.floor(x/System.grabbed_slot.Width)*System.grabbed_slot.Width : Math.floor(x/10)*10
    hl_box.style.top = System.grabbed_slot instanceof Tile ? Math.floor(y/System.grabbed_slot.Height)*System.grabbed_slot.Height : Math.floor(y/10)*10
}
map_editor.onmouseleave= (e)=>{
    hl_box.style.display = "none"
}

map_editor.onclick = (e)=>{
    let rect = e.target.getBoundingClientRect()
    if (System.grabbed_slot!=null) Add_Component(System.grabbed_slot, parseInt(hl_box.style.left, 10), parseInt(hl_box.style.top, 10))
}


// editor
const editor = document.createElement("div")
editor.style = "position: absolute; margin: auto; background: lightgrey"
editor.style.width  = parseInt(container.style.width, 10)/3-parseInt(container.style.border, 10)
editor.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2


// close button
const close_btn = document.createElement("div")
close_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/exit_button.png'); background-size: 100% 100%"
close_btn.style.width = close_btn.style.height = parseInt(editor.style.width, 10)/7.5
close_btn.margin = 10
close_btn.style.left = parseInt(editor.style.width, 10)-parseInt(close_btn.style.width, 10)-close_btn.margin
close_btn.style.top = close_btn.margin
close_btn.setAttribute("class", "button")

// open button
const open_btn = document.createElement("div")
open_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/open_button.png'); background-size: 100% 100%; display: none"
open_btn.style.width = open_btn.style.height = parseInt(close_btn.style.width, 10)
open_btn.margin = 10
open_btn.style.left = 0
open_btn.style.top = open_btn.margin
open_btn.setAttribute("class", "button")


// selectors

const component_drop_down = document.createElement("SELECT")
component_drop_down.style = "border: 3px solid black;position: absolute; margin: auto; text-align: center; font-size: 30; border-radius: 10px; user-select: none"
component_drop_down.margin = 10
component_drop_down.style.width = parseInt(editor.style.width, 10)-component_drop_down.margin*2
component_drop_down.style.height = 40
component_drop_down.style.left = component_drop_down.margin
component_drop_down.style.top = parseInt(close_btn.style.top, 10)+parseInt(close_btn.style.height, 10)+component_drop_down.margin


for (let component of System.components){
    let option = document.createElement("option")
    let t = document.createTextNode(component);
    option.appendChild(t)
    component_drop_down.appendChild(option)
}
component_drop_down.onchange = ()=>{
    System.current_component = component_drop_down.options[component_drop_down.selectedIndex].value
    Make_Slots()
}


const selector_container = document.createElement("div")
selector_container.style = "position: absolute; margin: auto; background: grey; border: 3px solid black; overflow-y: scroll"
selector_container.margin = 10
selector_container.style.width = parseInt(editor.style.width, 10)-selector_container.margin*2
selector_container.style.height = parseInt(editor.style.height, 10)*2/3
selector_container.style.left = parseInt(editor.style.width, 10)/2-parseInt(selector_container.style.width, 10)/2
selector_container.style.top = parseInt(component_drop_down.style.top, 10)+parseInt(component_drop_down.style.height, 10)+selector_container.margin


// save button
const save_btn = document.createElement("div")
save_btn.style = "background: #7B68EE;user-select: none;position: absolute; margin: auto; border: 3px solid black; border-radius: 10px; text-align: center; font-size: 37; color: white"
save_btn.margin = 30
save_btn.style.width = parseInt(editor.style.width, 10)-save_btn.margin*2
save_btn.style.height = parseInt(editor.style.height, 10)/15
save_btn.style.left = save_btn.margin-parseInt(save_btn.style.border, 10)
save_btn.style.top = parseInt(editor.style.height, 10)-parseInt(save_btn.style.height, 10)-save_btn.margin
save_btn.innerHTML = "Save Game"
save_btn.setAttribute("class", "button")


// add button
const add_btn = document.createElement("div")
add_btn.style = "background: white; text-align: center; position: absolute; margin: auto; border: 3px solid black; color: black; font-size: 45; user-select: none; border-radius: 10px"
add_btn.margin = 10
add_btn.style.width = parseInt(selector_container.style.width, 10)-add_btn.margin*4
add_btn.style.height = parseInt(selector_container.style.height, 10)/10
add_btn.innerHTML = "+"
add_btn.setAttribute("class", "button")
add_btn.style.left = add_btn.style.top = add_btn.margin


// component creator menu
const properties_container = document.createElement("div")
properties_container.style = "position: absolute; margin: auto; background: lightgrey; overflow-y: scroll"
properties_container.style.width = parseInt(container.style.width, 10)/3-parseInt(container.style.border, 10)
properties_container.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2

// header
const header = document.createElement("div")
header.style = "position: absolute; margin: auto;font-size: 50; color: black; text-align: center; user-select: none"
header.style.width = parseInt(properties_container.style.width, 10)/2; header.style.height = 50
header.style.left = header.style.top = 20
header.innerHTML = "Properties"
properties_container.appendChild(header)


// highlight box
const hl_box = document.createElement("div")
hl_box.style = "position: absolute; margin: auto; border: 3px solid lightblue; width: 100; height: 100; display: none"


// map list 
const map_container = document.createElement("div")
map_container.style = "position: absolute; margin: auto; border: 3px solid black; background: grey; display: none"
map_container.margin = 10
map_container.style.width = parseInt(editor.style.width, 10)-map_container.margin*2
map_container.style.height = parseInt(editor.style.height, 10)*3/4
map_container.style.left = parseInt(editor.style.width, 10)/2-parseInt(map_container.style.width, 10)/2
map_container.style.top = parseInt(close_btn.style.top, 10)+parseInt(close_btn.style.height, 10)+map_container.margin

const add_map_btn = document.createElement("div")
add_map_btn.style = "display: none;background: white; text-align: center; position: absolute; margin: auto; border: 3px solid black; color: black; font-size: 45; user-select: none; border-radius: 10px"
add_map_btn.margin = 10
add_map_btn.style.width = parseInt(map_container.style.width, 10)-add_map_btn.margin*4
add_map_btn.style.height = parseInt(map_container.style.height, 10)/10
add_map_btn.innerHTML = "+"
add_map_btn.setAttribute("class", "button")
add_map_btn.style.left = parseInt(map_container.style.width, 10)/2-parseInt(add_map_btn.style.width, 10)/2
add_map_btn.style.top = add_map_btn.margin


const map_show_btn = document.createElement("div")
map_show_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/map_button.png'); background-size: 100% 100%"
map_show_btn.style.width = map_show_btn.style.height = parseInt(close_btn.style.width, 10)
map_show_btn.margin = 10
map_show_btn.style.left = parseInt(close_btn.style.left, 10)-parseInt(map_show_btn.style.width, 10)-map_show_btn.margin
map_show_btn.style.top = map_show_btn.margin
map_show_btn.setAttribute("class", "button")
map_show_btn.clicked = false

const map_name = document.createElement("div")
map_name.style = "user-select: none; position: absolute; margin: auto; background: white; border: 3px solid black; color: black; text-align: center"
map_name.style.width = parseInt(map_editor.style.width, 10)/4
map_name.style.height = parseInt(map_editor.style.height,10)/20
map_name.style.fontSize = parseInt(map_name.style.height, 10)*0.9


// dialogue ui
const dialogue_box = document.createElement("div")
dialogue_box.style = `user-select: none; position: absolute; margin: auto; 
background: black; border: 3px solid white; color: white;
text-align: left; padding-left: 20px; padding-top: 5px;`
dialogue_box.style.width = canvas.style.width
dialogue_box.style.height = parseInt(canvas.style.height, 10)/3
dialogue_box.style.fontSize = parseInt(dialogue_box.style.height, 10)/5
dialogue_box.style.top = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*1.5-parseInt(dialogue_box.style.height, 10)-parseInt(dialogue_box.style.border, 10)

const dialogue_name = document.createElement("div")
dialogue_name.style = `user-select: none; position: absolute; margin: auto; 
background: black; color: white; text-align: center; 
border-top-right-radius: 30px; border: 3px solid white;`
dialogue_name.style.width = parseInt(dialogue_box.style.width, 10)/3.5
dialogue_name.style.height = parseInt(dialogue_box.style.height, 10)/4
dialogue_name.style.fontSize = parseInt(dialogue_name.style.height, 10)*0.8
dialogue_name.style.top = parseInt(dialogue_box.style.top, 10)+parseInt(dialogue_box.style.border, 10)*0.5-parseInt(dialogue_name.style.height, 10)

const dialogue_char = document.createElement("div")
dialogue_char.style = "user-select: none; position: absolute; margin: auto; background: none"
dialogue_char.style.width = dialogue_char.style.height = parseInt(dialogue_name.style.width, 10)
dialogue_char.style.left = 20
dialogue_char.style.top = parseInt(dialogue_box.style.top, 10)-parseInt(dialogue_char.style.height, 10)


// title button
const title_screen_btn = document.createElement("div")
title_screen_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/title_screen_button.png'); background-size: 100% 100%"
title_screen_btn.style.width = title_screen_btn.style.height = parseInt(close_btn.style.width, 10)
title_screen_btn.margin = 10
title_screen_btn.style.left = parseInt(map_show_btn.style.left, 10)-parseInt(title_screen_btn.style.width, 10)-title_screen_btn.margin
title_screen_btn.style.top = title_screen_btn.margin
title_screen_btn.setAttribute("class", "button")
title_screen_btn.clicked = false

// title container
const title_container = document.createElement("div")
title_container.style = "position: absolute; margin: auto; border: 3px solid black; background: grey; display: none"
title_container.margin = 10
title_container.style.width = parseInt(editor.style.width, 10)-title_container.margin*2
title_container.style.height = parseInt(editor.style.height, 10)*3/4
title_container.style.left = title_container.margin-parseInt(title_container.style.border, 10)/2
title_container.style.top = parseInt(close_btn.style.top, 10)+parseInt(close_btn.style.height, 10)+title_container.margin

const title_preview = document.createElement("div")
title_preview.style = "display: none;position: absolute; margin: auto; background: grey; overflow: hidden"
title_preview.style.width = parseInt(container.style.width, 10)*2/3-parseInt(container.style.border, 10)
title_preview.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2
title_preview.style.left = parseInt(container.style.width, 10)-parseInt(title_preview.style.width, 10)-parseInt(container.style.border, 10)*2

const title_preview_mask = document.createElement("div")
title_preview_mask.style = "display: none;position: absolute; margin: auto; background: grey;"
title_preview_mask.style.width = parseInt(container.style.width, 10)*2/3-parseInt(container.style.border, 10)
title_preview_mask.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2
title_preview_mask.style.left = parseInt(container.style.width, 10)-parseInt(title_preview_mask.style.width, 10)-parseInt(container.style.border, 10)*2

// project div
const project_div = document.createElement("input")
project_div.style = "position: absolute; background: white; border: 2px solid black; border-radius: 5px;font-size: 25"
project_div.style.width = parseInt(close_btn.style.width, 10)*2
project_div.style.height = parseInt(close_btn.style.width, 10)
project_div.style.left = parseInt(title_screen_btn.style.left, 10)-parseInt(project_div.style.width, 10)-title_screen_btn.margin
project_div.style.top = title_screen_btn.margin
// back button
const back_btn = document.createElement("div")
back_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/back_btn.png'); background-size: 100% 100%"
back_btn.style.width = back_btn.style.height = parseInt(close_btn.style.width, 10)
back_btn.style.left = title_screen_btn.margin//parseInt(project_div.style.left, 10)-parseInt(back_btn.style.width, 10)-title_screen_btn.margin
back_btn.style.top = title_screen_btn.margin
back_btn.setAttribute("class", "button")

System.editor_elems = [
    editor,
    close_btn,
    component_drop_down,
    selector_container
]


close_btn.onclick = ()=>{
    System.editor_elems.forEach((elem)=>{elem.style.display = "none"})
    map_editor.style.display = "none"
    open_btn.style.display = "block"
    
    add_map_btn.style.display = "block"
    map_container.style.display = "none"
    map_show_btn.clicked = false

    Release_Slot()
    Reset_Game()
    Start_Game()
}

open_btn.onclick = ()=>{
    System.editor_elems.forEach((elem)=>{elem.style.display = "block"})
    map_editor.style.display = "block"
    close_btn.style.display = "block", open_btn.style.display = "none"
    
    Reset_Comps()
    Release_Slot()
    Reset_Game()
    Reset_Comps()
}

add_btn.onclick = ()=>{
    Add_Slot(System.current_component)
}

add_map_btn.onclick = ()=>{
    Add_Map()
}

map_show_btn.onclick = ()=>{
    title_screen_btn.clicked = false
    title_container.style.display = "none"
    map_show_btn.clicked = !map_show_btn.clicked
    map_container.style.display = map_show_btn.clicked ? "block":"none"
    add_map_btn.style.display = map_show_btn.clicked ? "block":"none"
    Release_Slot()
}

title_screen_btn.onclick = ()=>{
    map_show_btn.clicked = false
    map_container.style.display = "none"
    title_screen_btn.clicked = !title_screen_btn.clicked
    title_container.style.display = title_screen_btn.clicked ? "block":"none"
    Release_Slot()
    Show_Title_Menu()
}

dialogue_box.onclick = ()=>{
    if (dialogue_box.style.opacity==0) return
    clearTimeout(recurse_timeout)
    if (!System.oDialogue || System.oDialogue.Interaction.parsed[System.Progress][System.oDialogue.Progress+1]==undefined) return
        System.oDialogue.Progress++ 
    Interpreter.Run(System.oDialogue.Interaction.parsed[System.Progress][System.oDialogue.Progress])
}

save_btn.onclick = ()=>SaveGame()

project_div.onchange = ()=>System.project_name=project_div.value

back_btn.onclick = ()=>{
    if (confirm("Return to main menu? Unsaved progress will be lost.")) window.location.reload()
}


function Reset_Comps(){
    [...map_editor.childNodes].forEach((child)=>{
        child.style.left = parseInt(child.style.left, 10)+System.offset.x
        child.style.top = parseInt(child.style.top, 10)+System.offset.y
    })
    System.offset = {x: 0, y:0}
}