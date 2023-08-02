function CreateTitleScreen(){
    Array(title_preview).forEach(elem=>{
        container.appendChild(elem)
        elem.style.width = parseInt(container.style.width, 10)-parseInt(container.style.border, 10)*2
        elem.style.height = parseInt(container.style.height, 10)-parseInt(container.style.border, 10)*2
        elem.style.left = elem.style.top = 0
        elem.style.display="block"
    })

    let title_text = document.createElement("div")
    title_text.id = "title text"
    title_text.style = "position: absolute; margin: auto; background: none; color: white; text-align: center;"
    title_text.style.width = parseInt(title_preview.style.width, 10)*2/3, title_text.style.height = parseInt(title_preview.style.height, 10)/5
    title_text.style.left = parseInt(title_preview.style.width, 10)/2-parseInt(title_text.style.width, 10)/2 
    title_text.style.top = parseInt(title_preview.style.height, 10)/2-parseInt(title_text.style.height, 10)

    let start_btn = document.createElement("button")
    start_btn.setAttribute("class", "button")
    start_btn.style = "position: absolute; margin: auto; border-radius: 10px; border: 1px solid black; background: lightgrey; text-align: center; color: black; font-size: 30"
    start_btn.style.width = parseInt(title_preview.style.width, 10)/5
    start_btn.style.height = parseInt(title_preview.style.height, 10)/10
    start_btn.innerHTML = "Start"
    start_btn.style.left = parseInt(title_preview.style.width, 10)/2-parseInt(start_btn.style.width, 10)/2 
    start_btn.style.top = parseInt(title_preview.style.height, 10)/2+10

    let title_mask = document.createElement("div")
    title_mask.id = "title mask"
    title_mask.style = "position: absolute; margin: auto; background: black; opacity: 0"
    title_mask.style.width = title_preview.style.width
    title_mask.style.height = title_preview.style.height

    Array(title_mask,title_text, start_btn).forEach(elem=>title_preview.appendChild(elem))
    Show_Title_Preview()

    start_btn.onclick = ()=>{
        Start_Game()
        System.Render_Objects() 
        Array(title_mask,title_text, start_btn).forEach(elem=>title_preview.removeChild(elem))
        Array(map_editor, dialogue_box, dialogue_char, dialogue_name, close_btn).map(i=>i.style.display="none")
        Array(canvas, dialogue_box, dialogue_char, dialogue_name).forEach(elem=>container.appendChild(elem))
    }
}