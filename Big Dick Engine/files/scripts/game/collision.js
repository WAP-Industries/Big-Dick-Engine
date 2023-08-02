function Get_Collision(dir){
    for (var type_list in System.render_list){
        for (var obj of System.render_list[type_list]){
            if (obj!=Search_Player() && Check_Collision(obj, dir) && obj.Collidable && obj.Map==System.Game_Map){
                return {collide: true, door: System.render_list.Door.includes(obj) ? obj:false, object: obj}
            }
        }
    }
    return {collide: false, door: false, object: false}
}

function Check_Dialogue(){
    for (var key in keys){
        if (Get_Collision(key).collide){
            var obj = Get_Collision(key).object
            if (obj.id=="Character" && obj.Interaction.parsed[System.Progress]==undefined) return
                if (obj.id=="Character" && 
                    obj.Interaction.parsed[System.Progress].length>0 && 
                    obj.Interaction.parsed[System.Progress][obj.Progress].join().length>0 && 
                    dialogue_box.style.display!="block" && Object.keys(keys).some(key=>keys[key]) && System.bDialogue) {
                System.bDialogue = false
                System.oDialogue = obj
                Object.keys(keys).forEach(key=>keys[key]=false)
                Array(System.oDialogue, System.render_list.Character.filter(i=>i.isPlayer && i.Map==System.Game_Map)[0])
                    .forEach(i=>Swap_Image(i, i[`Idle_${i.Direction}`]))
                
                Interpreter.Run(obj.Interaction.parsed[System.Progress][0])
            }
            return true
        }
    }
    return false
}


function Check_Collision(obj, dir){
    var player = Search_Player()

    switch (dir){

    case "w":
        if (
            obj.X<=player.X+player.Width
            && obj.X+obj.Width>=player.X
            && obj.Y+obj.Height>player.Y-player.Speed
            && obj.Y<player.Y
        ) return true
    break;

    case "s":
        if (
            obj.X<=player.X+player.Width
            && obj.X+obj.Width>=player.X
            && obj.Y<player.Y+player.Height+player.Speed
            && obj.Y>player.Y
        ) return true
    break;

    case "a":
        if (
            obj.Y<=player.Y+player.Height
            && obj.Y+obj.Height>=player.Y
            && obj.X+obj.Width>player.X-player.Speed
            && obj.X<player.X
        ) return true
    break;

    case "d":
        if (
            obj.Y<=player.Y+player.Height
            && obj.Y+obj.Height>=player.Y
            && obj.X<player.X+player.Width+player.Speed
            && obj.X>player.X
        ) return true
    break;

    }
}