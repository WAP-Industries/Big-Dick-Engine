function FitText(div, size){
    if (size) div.style.fontSize = size

    div.style.fontSize = parseFloat(div.style.fontSize)-1
    
    if (div.scrollHeight > div.clientHeight) FitText(div)
}