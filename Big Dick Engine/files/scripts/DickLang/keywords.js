TokenInfo = (tokens, argtypes=[]) => ({args: argtypes, pattern: tokens})

class Keywords{
    static Variable_Types = ["string", "number", "pointer"]
    static Global_Variables = {}
    static Scopes = {"$": "Local", "%": "Global"}

    static declare = {
        "local":{
            info: TokenInfo(["declare", "type", "name", "args"], ["*"]),
            func: (...args)=>{
                System.oDialogue.Interaction.variables[args[1]] = {
                    type: args[0], 
                    value: args[0]=="number" ? +args[2]:args[2].toString(),
                    reference: args[3]
                }
                Interpreter.Skip()
            }
        },
        "global":{
            info: TokenInfo(["declare", "type", "name", "args"], ["*"]),
            func: (...args)=>{
                Keywords.Global_Variables[args[1]] = {
                    type: args[0], 
                    value: args[0]=="number" ? +args[2]:args[2].toString(),
                    reference: args[3]
                }
                Interpreter.Skip()
            }
        }
    }

    static env = {
        "dialogue-background": {
            arg: "string",
            func: (val)=> Set_Image(dialogue_box, val)
        },
        "dialogue-textcolor": {
            arg: "string",
            func: (val)=>dialogue_box.style.color = val
        },
        "dialogue-fontsize": {
            arg: "number",
            func: (val)=>dialogue_box.style.fontSize = val
        },
        "dialogue-textspeed": {
            arg: "number",
            func: (val)=>System.TextSpeed = val
        },
        "dialogue-namecolor": {
            arg: "string",
            func: (val)=>dialogue_name.style.color = val
        },
        "dialogue-namebackground": {
            arg: "string",
            func: (val)=> Set_Image(dialogue_name, val)
        },
        "map-background": {
            arg: "string",
            func: (val)=>System.Maps[Object.keys(System.Maps)[System.Game_Map]].RenderBackground = val
        }
    }

    static sys = {
        speak: {
            info: TokenInfo(["sys", "character", "args"], ["string"]),
            func: (char, string)=>trigger_dialogue(char, string)
        },
        remove: {
            info: TokenInfo(["sys", "character"]),
            func: (char)=>{
                if (Search_Char(char)) Delete_Component(Search_Char(char), "Character")
                Interpreter.Skip()
            }
        },
        mjump: {
            info: TokenInfo(["sys", "character", "args"], ["string", "number", "number"]),
            func: (char, map, x, y)=>{
                if (!System.Maps[map])
                    return Debugger.RunTimeError("Reference", `Map ${map} does not exist`)
                Search_Char(char).Map = Object.keys(System.Maps).indexOf(map)
                SetObject(Search_Char(char), x, y)
                Interpreter.Skip()
            }
        },
        jump: {
            info: TokenInfo(["sys", "character", "args"], ["number", "number"]),
            func: (char, x, y)=>{
                SetObject(Search_Char(char), x, y)
                Interpreter.Skip()
            }
        },
        walk: {
            info: TokenInfo(["sys", "character", "args"], ["number", "number"]),
            func: (char, x, y)=>{
                let c = Search_Char(char)
                if (typeof c.Speed!="number") 
                    return Debugger.RunTimeError("Type", "Character Component Speed is not a number.")
                let s = c.Speed
                let angle = Math.atan2(y-c.Y, x-c.X)
                let velocity = {x: Math.cos(angle)*s, y: Math.sin(angle)*s}
                Change_Direction_Image(velocity, c)
                const w = setInterval(()=>{
                    MoveObject(c, "x", velocity.x), MoveObject(c, "y", velocity.y)
                    if (Array(y-c.Y, x-c.X).every(val=>Math.abs(val)<s)) clearInterval(w)
                }, 10)
                Interpreter.Skip()
            }
        },
        mutate: {
            info: TokenInfo(["sys", "character", "args"], ["string", "string"]),
            func: (char, prop, val)=>{
                let _char = Search_Char(char)
                let _prop = Parser.StripSpace(prop)

                if (!(_prop in _char))
                    return Debugger.RunTimeError("Reference", "Character Component property does not exist")

                if (Character.restricted.includes(_prop))
                    return Debugger.RunTimeError("Reference", "Access restricted to Character Component property")

                if (Debugger.GetArgType(_char[_prop], val)==null)
                    return Debugger.RunTimeError("Type", "Type mismatch between Character Component property and argument")

                let savedlist
                if (Array.isArray(Debugger.GetArgType(_char[_prop], val))){
                    for (let imglist of ["Idle_Left", "Idle_Right", "Idle_Up", "Idle_Down", "Walking_Left", "Walking_Right", "Walking_Up", "Walking_Down"]){
                        if (_char.Image.join()==_char[imglist].join()){
                            savedlist = imglist
                            break
                        }
                    }
                }

                _char[_prop] = Debugger.GetArgType(_char[_prop], val)
                if (Array.isArray(Debugger.GetArgType(_char[_prop], val)) && savedlist!=undefined) _char.Image = _char[savedlist]

                if (_char.isPlayer){
                    System.render_list.Character
                        .filter(i=>i.isPlayer)
                        .forEach(i=>{
                            i[_prop]=_char[_prop]
                            if (Array.isArray(Debugger.GetArgType(_char[_prop], val)) && savedlist!=undefined) i.Image = i[savedlist]
                        })
                }

                Interpreter.Skip()
            }
        }
    }


    static command = {
        change:{
            info: TokenInfo(["command", "args"], ["string", "number", "number"]),
            func: (map, x, y)=>{
                if (!System.Maps[map])
                    return Debugger.RunTimeError("Reference", `Map ${map} does not exist`)
                Change_Map(Object.keys(System.Maps).indexOf(map))

                ShiftMap("x", -x)
                ShiftMap("y", -y)
                
                Interpreter.Skip()
            }
        },
        esc: {
            info: TokenInfo(["command"]),
            func: ()=>{
                Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>{elem.style.display="none";elem.style.opacity=1})
                if (System.oDialogue!=null) System.oDialogue.Progress = 0; 
                System.oDialogue = null
                Object.keys(keys).forEach(i=>keys[i]=false)
            }
        },
        pesc: {
            info: TokenInfo(["command"]),
            func:()=>{Interpreter.Run(["esc"]); System.Progress++}
        },
        jesc: {
            info: TokenInfo(["command", "args"], ["number"]),
            func: (pnum)=>{Interpreter.Run(["esc"]); System.Progress+=pnum}
        },
        desc: {
            info: TokenInfo(["command", "args"], ["number"]),
            func: (pnum)=>{Interpreter.Run(["esc"]); System.Progress=pnum}
        },
        choice: {
            info: TokenInfo(["command", "args"], ["*"]),
            func: (...args)=> trigger_choice(System.oDialogue, ...args)
        },
        hide: {
            info: TokenInfo(["command"]),
            func: ()=> {
                Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>elem.style.opacity=0)
                Object.keys(keys).forEach(i=>keys[i]=false)
                Interpreter.Skip()
            }
        },
        show: {
            info: TokenInfo(["command"]),
            func: ()=> {
                Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>elem.style.opacity=1)
                Object.keys(keys).forEach(i=>keys[i]=false)
                Interpreter.Skip()
            }
        },
        delay: {
            info: TokenInfo(["command", "args"], ["number"]),
            func: (time)=> setTimeout(()=>Interpreter.Skip(), time)
        },

        end: {
            info: TokenInfo(["command", "args"], ["*"]),
            func: (...args)=> game_end(args)
        },
        play: {
            info: TokenInfo(["command", "args"], ["string", "number", "boolean"]),
            func: (src, volume, loop)=>{
                let audio = new Audio(src)
                audio.volume = volume, audio.loop = loop
                audio.play()
                System.Audio[src] = audio
                
                Interpreter.Skip()
            }
        },
        pause: {
            info: TokenInfo(["command", "args"], ["string"]),
            func: (src)=> {
                if (!AudioError("pause", src)) return
                System.Audio[src].pause()
                Interpreter.Skip()
            }
        },
        resume:{
            info: TokenInfo(["command", "args"], ["string"]),
            func: (src)=>{
                if (!AudioError("resume", src)) return
                System.Audio[src].play()
                Interpreter.Skip()
            }
        },
        restart:{
            info: TokenInfo(["command", "args"], ["string"]),
            func: (src)=>{
                if (!AudioError("restart", src)) return
                System.Audio[src].pause()
                System.Audio[src].currentTime = 0
                System.Audio[src].play()
            }
        },
        clear: {
            info: TokenInfo(["command", "args"], ["string"]),
            func: (src)=>{
                if (!AudioError("clear", src)) return
                System.Audio[src].pause()
                delete System.Audio[src]
                Interpreter.Skip()
            }
        },
        clearaudio:{
            info: TokenInfo(["command"]),
            func: (src)=>{
                Object.keys(System.Audio).forEach(key=>System.Audio[key].pause())
                System.Audio = {}
                Interpreter.Skip()
            }
        }
    }
}

function AudioError(cmd, src){
    if (!System.Audio[src]) 
        Debugger.RunTimeError("Reference", "Invalid audio source")
    return !!System.Audio[src]
}