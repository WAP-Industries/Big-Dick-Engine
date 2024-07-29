class System{

    static components = ["Tile", "Sprite", "Door", "Character"]
    static classes = [Tile, Sprite, Door, Character]
    static render_list = {
        "Tile": [],
        "Sprite": [],
        "Door": [],
        "Character": [],
    }
    static saved_render_list = null

    static non_compare_props = {
        "Character": ["ImgIndex", "Image", "Elapsed", "SavedObject"],
        "Sprite": ["ImgIndex", "Elapsed", "SavedObject"],
        "Tile": ["ImgIndex", "Elapsed", "SavedObject"],
        "Door": ["Imgindex", "Elapsed", "SavedObject"],
    } 

    static funcs = {
        "Character": [
            ["Name"], 
            ["Width"],
            ["Height"],
            ["Idle_Down", true], ["Idle_Up", true], ["Idle_Right", true], ["Idle_Left", true],  
            ["Walking_Down", true], ["Walking_Up", true], ["Walking_Right", true], ["Walking_Left", true],  
            ["Dialogue"],
            ["Dialogue_Sound"],
            ["Animation_Cycle"],
            ["Speed"],
            ["Wander_Radius"],
            ["Collidable", "checkbox"],
            ["Visible", "checkbox"]
        ],

        "Sprite": [
            ["Width"],
            ["Height"],
            ["Image", true],
            ["Animation_Cycle"],
            ["Collidable", "checkbox"],
            ["Visible", "checkbox"]
        ],
        "Tile": [
            ["Image", true],
            ["Animation_Cycle"],
            ["Collidable", "checkbox"],
            ["Visible", "checkbox"]
        ],
        "Door": [
            ["Width"],
            ["Height"],
            ["Image", true],
            ["Animation_Cycle"],
            ["Target"],
            ["Deviate_X"],
            ["Deviate_Y"],
            ["Collidable", "checkbox"],
            ["Visible", "checkbox"]
        ]
    }

    static project_name = null

    static map_fields = ["Name", "Scale", "Background"]

    static title_screen = {Name: "",  Text_Color: "", Background: "", Background_Opacity: ""}

    static offset = {x: 0, y:0}
    static game_offset = {x: 0, y:0}
    static scroll_step = 10


    static current_component = System.components[0]
    static slots = System.pop_slots()

    static grabbed_slot = null
    static bDialogue = true
    static oDialogue = null

    
    static Maps = {}
    static Current_Map = null
    static Game_Map = 0
    static Player = null
    static Audio = {}

    static Progress = 0
    static Ended = false

    static TextSpeed = 20

    static Assets = {}


    static pop_slots(){
        let slots = {}
        for (let component of System.components) slots[component] = []
        return slots
    }


    static Get_Image(src){
        if (System.Assets[src]==undefined){
            let img = new Image();
            img.src = src
            System.Assets[src] = img
        }

        return System.Assets[src]
    }

    static InView(object){
        return (
            object.X+object.Width>0 &&
            object.X<canvas.width &&
            object.Y+object.Height>0 &&
            object.Y<canvas.height
        )
    }

    static Render(object){
        if (!object.Visible || !(System.InView(object))) return
        if (object.id=="Character" && !object.isPlayer) Change_Idle_Image(object)
        context.drawImage(System.Get_Image(object.Image[object.ImgIndex]), object.X, object.Y, object.Width, object.Height)

        if (object.Image.length==1) return
        object.Elapsed++
        if (object.Elapsed%object.Animation_Cycle==0){
            object.Elapsed = 0
            object.ImgIndex++
            if (object.ImgIndex>=object.Image.length) object.ImgIndex = 0
        }
    }


    static Render_Objects(){
        window.requestAnimationFrame(System.Render_Objects)
        context.clearRect(0,0,canvas.width, canvas.height)

        if (System.Ended){
            context.fillStyle = "black";
            context.fillRect(0,0,canvas.width, canvas.height)
            return
        }
        if (map_editor.style.display!="none") return

        if (System.Maps[Object.keys(System.Maps)[System.Game_Map]]!=undefined){
            switch (System.Maps[Object.keys(System.Maps)[System.Game_Map]].RenderBackground.includes(".")){
                case true:
                    context.drawImage(
                        System.Get_Image(System.Maps[Object.keys(System.Maps)[System.Game_Map]].RenderBackground),
                        0,0,canvas.width, canvas.height
                    )
                break;
                case false:
                    context.fillStyle = System.Maps[Object.keys(System.Maps)[System.Game_Map]].RenderBackground
                    context.fillRect(0,0,canvas.width, canvas.height)
                break;
            }
        }


        for (let type_list in System.render_list){
            System.render_list[type_list].filter(object=>object.Map==System.Game_Map).forEach(object=>System.Render(object))
        }

        if (!Object.keys(keys).some(key=>keys[key]) && dialogue_box.style.display!="block") System.bDialogue=true


        if (System.Current_Map!=null) Set_Image(map_editor, System.Current_Map.Background)


        for (let key in keys){
            let door = Get_Collision(key).door
            if (door){
                Change_Map(Object.keys(System.Maps).indexOf(Get_Collision(key).door.Target))
                
                ShiftMap("x", -door.Deviate_X ?? 0)
                ShiftMap("y", -door.Deviate_Y ?? 0)
                break
            }
        }

        if (dialogue_box.style.display=="block") return
        if (keys.w) {
            if (!Get_Collision("w").collide) Move_Map("y", 1)
        }
        if (keys.a) {
            if (!Get_Collision("a").collide) Move_Map("x", 1)
        }
        if (keys.s) {
            if (!Get_Collision("s").collide) Move_Map("y", -1)
        }
        if (keys.d) {
            if (!Get_Collision("d").collide) Move_Map("x", -1)
        }

        Check_Dialogue()
    }   
}