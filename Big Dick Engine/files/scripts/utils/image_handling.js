function Swap_Image(object, image_list){
    if (object.Image==image_list || image_list.filter(i=>i!="").length==0) return

    object.Image = image_list
    object.ImgIndex = 0
}

function Change_Direction_Image(velocity, char){
    let hori_dir = velocity.x>=0 ? "Right":"Left"
    let vert_dir = velocity.y>=0 ? "Down":"Up"
    let dir = Math.abs(velocity.x)>Math.abs(velocity.y) ? hori_dir:vert_dir

    let actual_dir = `Walking_${dir}`
    let avai_dir = `Walking_${[hori_dir, vert_dir].filter(i=>i!=dir)[0]}`

    char.Image = char[actual_dir].filter(i=>i!="").length>0 ? char[actual_dir]:(char[avai_dir].filter(i=>i!="").length>0 ? char[avai_dir]:char.Image)
}

function Change_Idle_Image(char){
    if (char[`Idle_${char.Direction}`].filter(i=>i!="").length>0)
        char.Image = char[`Idle_${char.Direction}`]
}


function Set_Image(div, background){
    if (background.includes(".")) div.style.backgroundImage = `url('${background}')`
    else div.style.background = background
    div.style.backgroundSize = "100% 100%"
}