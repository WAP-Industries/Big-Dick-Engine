function Start_Game(){
    for (var type_list in System.render_list){
        System.render_list[type_list]
            .filter(obj=>(typeof obj.Wander_Radius)=="number")
            .forEach(obj=>Wander(obj))
    }
}


function Reset_Game(){
    System.render_list = JSON.parse(System.saved_render_list)

    for (var map in System.Maps)
        System.Maps[map].RenderBackground = System.Maps[map].Background

    Keywords.Global_Variables = {}
    System.Game_Map = 0
    System.Progress = 0
    System.Ended = false
    Object.keys(System.Audio).forEach(key=>{
        System.Audio[key].pause()
        System.Audio[key].currentTime = 0
    })
    System.Audio = {}
    if (document.getElementById("EndText")) container.removeChild(document.getElementById("EndText"))
    Array(...container.childNodes).filter(i=>i.id=="choicebox").forEach(i=>container.removeChild(i))
    Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>elem.style.opacity=1)
    System.game_offset = {x:0, y:0}
    Reset_UI()
    Interpreter.Run(["esc"])
}


function Reset_UI(){
    Set_Image(dialogue_box, "black")
    dialogue_box.style.color="white"
    dialogue_box.style.fontSize=parseInt(dialogue_box.style.height, 10)/5
    System.TextSpeed=20
    dialogue_name.style.fontSize=parseInt(dialogue_name.style.height, 10)*0.8
    dialogue_name.style.color="white"
    Set_Image(dialogue_name, "black")
}


function Change_Map(map_index){
    for (var type_list in System.render_list){
        for (var obj of System.render_list[type_list]){
            if (obj.isPlayer || obj.Map!=System.Game_Map) continue
                
            MoveObject(obj, "x", System.game_offset.x)
            MoveObject(obj, "y", System.game_offset.y)
        }
    }
    System.game_offset = {x: 0, y: 0}

    System.Game_Map = map_index
}

function ShiftMap(coord, val){
    for (let type_list in System.render_list){
        System.render_list[type_list]
            .filter(obj=>obj.Map==System.Game_Map && !obj.isPlayer)
            .forEach(obj=>MoveObject(obj, coord, val))
    }
    System.game_offset[coord]-=val
}