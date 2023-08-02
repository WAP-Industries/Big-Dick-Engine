function Install_Default(){ 
    Create_Map()
    Create_Player()
}

function Create_Map(){
    System.Maps["base_world"] = {"Name": "base_world", "Map": [], "Scale": 100, "Background": "grey", "RenderBackground": "grey"}
    Make_Maps()
    Hide_Properties()

    System.Current_Map = System.Maps["base_world"]
    map_container.childNodes[1].click()
}


const PlayerSettings = new Character({
    Name: "Benis Man",
    Width: 100, Height: 100,
    Idle_Right: ["files/images/built_in/benisman1.png"],
    Idle_Left: ["files/images/built_in/benisman2.png"],
    Idle_Up: [],
    Idle_Down: [],
    Walking_Left: ["files/images/built_in/benisman2.png"],
    Walking_Right: ["files/images/built_in/benisman1.png"],
    Walking_Up: [],
    Walking_Down: [],
    Dialogue: "",
    Dialogue_Sound: "",
    Animation_Cycle: 20,
    Visible: true,
    Speed: 10,
    Map: System.Game_Map,
    isPlayer: true
})

function Create_Player(){
    let player = JSON.parse(JSON.stringify(PlayerSettings))

    System.Player = player

    Add_Component(
        player, 
        canvas.width/2-player.Width/2,
        canvas.height/2-player.Height/2
    )
}