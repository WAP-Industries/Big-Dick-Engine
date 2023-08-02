let end_index
let end_recurse

function game_end(text=[]){
    Interpreter.Run(["esc"])
    System.Ended = true
    end_index = function*(text, index){
        while (index<=text.length) yield index+=1
    }(text, 0)

    let end_text = document.createElement("div")
    end_text.id = "EndText"
    end_text.style = `position: absolute; top: 0; bottom:0; left:0; right: 0; margin: auto; 
    color: white; text-align: center; user-select: none;
    display: flex; align-items:center; justify-content:center;`
    end_text.style.width = parseInt(container.style.width, 10)*4/5
    end_text.style.height = parseInt(container.style.height, 10)*4/5
    container.appendChild(end_text)

    let end_text_btn = document.createElement("button")
    end_text_btn.setAttribute("class", "button")
    end_text_btn.style = "position: absolute; margin: auto; right: 10; bottom: 10; border: none; background: none;"
    end_text_btn.style.width = parseInt(container.style.width, 10)/20
    end_text_btn.style.height = parseInt(container.style.height, 10)/10
    end_text_btn.style.backgroundImage = "url('files/images/ui/end_text_btn.png')"
    end_text_btn.style.backgroundSize = "100% 100%"
    end_text.savetext = text
    end_text_btn.onclick = ()=>{
        clearInterval(end_recurse)
        let index = end_index.next().value
        if (index>=text.length-1) event.srcElement.style.display = "none"
        if (index>=text.length) return
        type_end(text[index])
    }

    container.appendChild(end_text_btn)
    if (0>=text.length-1) end_text_btn.style.display = "none"

    setTimeout(()=>type_end(text[0]), 100)
}

function type_end(text, index=0){
    let et = document.getElementById("EndText")
    if (index==0) et.innerHTML = ""
    if (index>=text.length) return
    et.innerHTML+=text[index]
    FitText(et, 50)
    setTimeout(()=>type_end(text, index+1), System.TextSpeed)
}