function Wander(char){
    if ((typeof char.Wander_Radius)!="number" || (typeof char.Speed)!="number") return

    let da = Math.random()*Math.PI*2
    let dx = char.WanderOrigin.x+Math.cos(da)*char.Wander_Radius
    let dy = char.WanderOrigin.y+Math.sin(da)*char.Wander_Radius

    char.WanderDest = {x: dx, y: dy}

    char.WanderInterval = setInterval(()=>{
        if (Compare_Object(System.oDialogue, char)) return
        if (WanderCollision(char)) ResetWander(char)

        let angle = Math.atan2(char.WanderDest.y-char.Y, char.WanderDest.x-char.X)
        let velocity = {
            x: Math.cos(angle)*char.Speed,
            y: Math.sin(angle)*char.Speed
        }
        Change_Direction_Image(velocity, char)
        char.X+=velocity.x
        char.Y+=velocity.y

        if (Array(char.WanderDest.y-char.Y, char.WanderDest.x-char.X).some(val=>Math.abs(val)<char.Speed))
            ResetWander(char)
    }, 10)
}


function ResetWander(char){
    clearInterval(char.WanderInterval)
    Wander(char)
}

function WanderCollision(obj){
    return Object.keys(keys).map(i=> i=Compare_Object(Get_Collision(i).object, obj)).filter(i=>i).length>0
}