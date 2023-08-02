function CreateProject(projectname){
    System.project_name = projectname
    project_div.value = projectname

    document.body.appendChild(container)
    
    Array(canvas, dialogue_box, dialogue_char, dialogue_name,map_editor, title_preview_mask, title_preview, editor, open_btn).forEach((elem)=>{container.appendChild(elem)})
    Array(dialogue_box, dialogue_char, dialogue_name).forEach(elem=>{elem.style.display = "none";elem.style.opacity=1})

    Array(close_btn, map_show_btn, title_screen_btn, project_div, back_btn, save_btn, component_drop_down, selector_container, map_container, title_container).forEach((elem)=>{editor.appendChild(elem)})

    map_container.appendChild(add_map_btn)

    editor.appendChild(properties_container)
    selector_container.style.overflowY = "auto"
    properties_container.style.display = "none"

    selector_container.appendChild(add_btn)

    map_editor.appendChild(hl_box)
    map_editor.appendChild(map_name)

    System.Render_Objects()
}