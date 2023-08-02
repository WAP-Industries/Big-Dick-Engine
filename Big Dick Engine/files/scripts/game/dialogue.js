let recurse_timeout

function type(string, speed, sound, index=0){  
    if (index==0) dialogue_box.innerHTML = ""
    if (index>=string.length || map_editor.style.display!="none") return
    dialogue_box.innerHTML+=string[index]
    
    dialogue_box.style.userSelect = "none"
    dialogue_box.style.overflowY = dialogue_box.scrollHeight>dialogue_box.clientHeight ? "scroll":"auto"
    
    const _ = function(){
        if (sound.replaceAll(" ", "").length==0) return
        if (!System.Audio[sound]) 
            System.Audio[sound] = new Audio(sound)
        System.Audio[sound].pause()
        System.Audio[sound].currentTime = 0
        try{System.Audio[sound].play()}catch{}
    }()

    recurse_timeout = setTimeout(()=>type(string, speed, sound, index+1), speed)
}


function trigger_dialogue(character, string){
    clearTimeout(recurse_timeout)
    if (!string || !character) return

    Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>elem.style.display = "block")

    dialogue_name.innerHTML = character
    FitText(dialogue_name, 100)

    dialogue_char.style.backgroundImage = `url('${Search_Char(character).Dialogue}')`
    dialogue_char.style.backgroundSize = "100% 100%"

    if (!Search_Char(character).isPlayer) AdjustDialogue(Search_Char(character))
    type(string, System.TextSpeed, Search_Char(character).Dialogue_Sound)
}


function AdjustDialogue(character){
    let dirs = ["w", "a", "s", "d"]
    let dir = function(){
        let dir = dirs.map(i=>Get_Collision(i))
        for (let d of dir){
            if (d.collide) return dirs[dir.indexOf(d)]
        }
    }()
    if (!dir) return
    let key_dir = {
        "w": "Down",
        "a": "Right",
        "s": "Up",
        "d": "Left"
    }
    if (character[`Idle_${key_dir[dir]}`].filter(i=>i!="").length>0)
        character.Image = character[`Idle_${key_dir[dir]}`]
}