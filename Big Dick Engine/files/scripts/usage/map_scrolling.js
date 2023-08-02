window.addEventListener("keydown", (e)=>{

    switch (e.keyCode){
        case 37:
            Scroll("left", 1)
        break;
        case 39:
            Scroll("left", -1)
        break;


        case 38:
            Scroll("top", 1)
        break;
        case 40:
            Scroll("top", -1)
        break
    }

})



function Scroll(dir, multi){

    if (System.grabbed_slot!=null) return

    if (dir=="left") System.offset.x+=System.scroll_step*-multi;
    if (dir=="top") System.offset.y+=System.scroll_step*-multi;

    [...map_editor.childNodes].forEach((child)=>{
            
        if (dir=="left") child.style.left = parseInt(child.style.left, 10)+multi*System.scroll_step
        if (dir=="top") child.style.top = parseInt(child.style.top, 10)+multi*System.scroll_step
    })

}   