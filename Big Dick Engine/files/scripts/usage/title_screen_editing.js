function Show_Title_Menu(){
    properties_container.style.display = "block"
    properties_container.style.overflowY = "auto"
    title_preview.style.display = "block"
    title_preview_mask.style.display = "block"

    // cancel btn
    const exit_btn = document.createElement("div")
    exit_btn.style = "position: absolute; margin: auto; background-image: url('files/images/ui/exit_button.png'); background-size: 100% 100%"
    exit_btn.style.width = exit_btn.style.height = parseInt(editor.style.width, 10)/7
    exit_btn.margin = 10
    exit_btn.style.left = parseInt(editor.style.width, 10)-parseInt(exit_btn.style.width, 10)-exit_btn.margin*2
    exit_btn.style.top = parseInt(header.style.top, 10)
    exit_btn.setAttribute("class", "button")
    properties_container.appendChild(exit_btn)

    for (let field of Object.keys(System.title_screen)){
        var box = document.createElement("input")
        box.style = "position: absolute; background: white; border: 2px solid black; border-radius: 5px;font-size: 25"
        box.margin = 20
        box.style.width = parseInt(properties_container.style.width, 10)-box.margin*2
        box.style.height = parseInt(properties_container.style.height, 10)/20
        box.style.left = box.margin
        box.style.top = box.margin+parseInt(header.style.top, 10)+parseInt(header.style.height, 10)+Object.keys(System.title_screen).indexOf(field)*parseInt(box.style.height, 10)+Object.keys(System.title_screen).indexOf(field)*box.margin

        box.placeholder = field
        box.value = System.title_screen[field]
        box.id = `title_property_${field}`
        properties_container.appendChild(box)

        box.oninput = ()=>{
            System.title_screen[event.srcElement.placeholder] = event.srcElement.value
            Show_Title_Preview()
        }
    }
    Show_Title_Preview()

    let title_text = document.createElement("div")
    title_text.id = "title text"
    title_text.style = "position: absolute; margin: auto; background: none; color: white; text-align: center;"
    title_text.style.width = parseInt(title_preview.style.width, 10)*2/3, title_text.style.height = parseInt(title_preview.style.height, 10)/5
    title_text.style.left = parseInt(title_preview.style.width, 10)/2-parseInt(title_text.style.width, 10)/2 
    title_text.style.top = parseInt(title_preview.style.height, 10)/2-parseInt(title_text.style.height, 10)

    let dummy_btn = document.createElement("button")
    dummy_btn.style = "position: absolute; margin: auto; border-radius: 10px; border: 1px solid black; background: lightgrey; text-align: center; color: black; font-size: 30"
    dummy_btn.style.width = parseInt(title_preview.style.width, 10)/5
    dummy_btn.style.height = parseInt(title_preview.style.height, 10)/10
    dummy_btn.innerHTML = "Start"
    dummy_btn.style.left = parseInt(title_preview.style.width, 10)/2-parseInt(dummy_btn.style.width, 10)/2 
    dummy_btn.style.top = parseInt(title_preview.style.height, 10)/2+10

    let title_mask = document.createElement("div")
    title_mask.id = "title mask"
    title_mask.style = "position: absolute; margin: auto; background: black; opacity: 0"
    title_mask.style.width = title_preview.style.width
    title_mask.style.height = title_preview.style.height

    Array(title_mask, title_text, dummy_btn).forEach(elem=>title_preview.appendChild(elem))

    exit_btn.onclick = ()=>{
        title_container.style.display = "none"
        title_preview.style.display = "none"
        title_preview_mask.style.display = "none"
        Hide_Properties()
    }
}

function Show_Title_Preview(){
    Set_Image(title_preview, System.title_screen.Background)

    try{
        document.getElementById("title text").innerHTML = System.title_screen.Name
        FitText(document.getElementById("title text"), 100)

        document.getElementById("title text").style.color = System.title_screen.Text_Color
    }catch{}

    try{
        document.getElementById("title mask").style.opacity = +System.title_screen.Background_Opacity  ? System.title_screen.Background_Opacity:0
    }catch{}
}