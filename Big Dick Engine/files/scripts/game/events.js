const keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

window.addEventListener("keydown", (e)=>{
    if ([map_editor, dialogue_box].some(elem=>elem.style.display=="block") || document.getElementById("MainMenu")) return

    let player = Search_Player()

    switch (e.key.toLowerCase()){
        case "w":
            keys.w = true
            Swap_Image(player, player.Walking_Up)
        break;

        case "a":
            keys.a = true
            Swap_Image(player, player.Walking_Left)
        break;
            
        case "s":
            keys.s = true
            Swap_Image(player, player.Walking_Down)
        break;
            
        case "d":
            keys.d = true
            Swap_Image(player, player.Walking_Right)
        break;
    }
})

window.addEventListener("keyup", (e)=>{

    if ([map_editor, dialogue_box].some(elem=>elem.style.display=="block") || document.getElementById("MainMenu")) return

    let player = Search_Player()

    switch (e.key.toLowerCase()){

        case "w":
            keys.w = false
            Swap_Image(player, player.Idle_Up)
        break;

        case "a":
            keys.a = false 
            Swap_Image(player, player.Idle_Left)
        break;
            
        case "s":
            keys.s = false
            Swap_Image(player, player.Idle_Down)
        break;
            
        case "d":
            keys.d = false
            Swap_Image(player, player.Idle_Right)
        break;
    }   
})


function Move_Map(coord, multi){
    if (close_btn.style.display!="none") return

    for (let type_list in System.render_list){
        for (let object of System.render_list[type_list]){
            if (object.Map==System.Game_Map && !object.isPlayer)
                MoveObject(object, coord, System.render_list.Character.filter(i=>i.isPlayer)[0].Speed*multi)
        }
    }

    System.game_offset[coord]-=System.render_list.Character.filter(i=>i.isPlayer)[0].Speed*multi
}


function MoveObject(obj, coord, val){
    obj[coord.toUpperCase()]+=val
    obj.WanderOrigin[coord]+=val
    if (obj.WanderDest) obj.WanderDest[coord]+=val
}

function SetObject(obj, x, y){
    obj.X = x, obj.Y = y
    obj.WanderOrigin = {x: x, y: y}
}