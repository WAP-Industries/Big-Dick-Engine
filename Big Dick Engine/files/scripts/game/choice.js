function trigger_choice(char, ...args){
    Object.keys(keys).forEach(i=>keys[i] = false)

    let _char = Search_Char(char.Name).SavedObject 

    let line = ["choice", args.join(" <> ")]

    if (args.length==0)
        return Debugger.RunTimeError("Type", "No arguments provided", line, _char)
    if (args.length%3!=0)
        return Debugger.RunTimeError(
            "Type", "Invalid number of arguments provided", 
            line, _char
        )

    for (var arg in args){
        if ((arg+1)%3) continue
        if ((+args[arg]).toString()=="NaN")
            return Debugger.RunTimeError("Type", "Type mismatch in argument", line, _char)
    }

    Array(dialogue_box, dialogue_name, dialogue_char).forEach(elem=>elem.style.display="none")

    for (var index=0;index<args.length;index+=3)
        CreateChoiceBox(args[index], args[index+1], args[index+2], [index/3, args.length/3])
}


function CreateChoiceBox(text, background, target, pos){
    var choicebox = document.createElement("div")
    choicebox.style = `position: absolute; margin: auto;
    border: 2px solid white; border-radius: 20px;
    text-align: center; user-select: none;
    display: flex; align-items:center; justify-content:center;`
    choicebox.style.width = canvas.width*4.5/7
    choicebox.style.height = canvas.height*1/9
    Set_Image(choicebox, background)

    choicebox.setAttribute("class", "button")
    choicebox.style.left = parseInt(canvas.style.left, 10)+canvas.width/2-parseInt(choicebox.style.width, 10)/2

    let dist = parseInt(choicebox.style.height, 10)+20
    choicebox.style.top = parseInt(container.style.top, 10)+canvas.height/2-pos[1]/2*dist+pos[0]*dist

    choicebox.innerHTML = text
    choicebox.target = target
    choicebox.id = "choicebox"


    choicebox.onclick = ()=>{
        if (System.oDialogue.Interaction.parsed[+event.srcElement.target][0]==undefined)
            return Debugger.RunTimeError("Reference", `Key [${+event.srcElement.target}] absent in Character Component Interaction property`, [])
        ClearChoice()
        System.Progress = +event.srcElement.target
        System.oDialogue.Progress = 0
        Interpreter.Run(System.oDialogue.Interaction.parsed[+event.srcElement.target][0])
    }

    container.appendChild(choicebox)
    FitText(choicebox, 100)
}


function ClearChoice(){
    for (var elem of [...container.childNodes]){
        if (elem.id=="choicebox") container.removeChild(elem)
    }
}