class Character{
    static id = "Character"

    constructor({
        Name="",
        Width=0, Height=0,
        Idle_Left=[],Idle_Right=[], Idle_Up=[], Idle_Down=[],
        Walking_Left=[],Walking_Right=[], Walking_Up=[], Walking_Down=[],
        Dialogue="",
        Dialogue_Sound="",
        Animation_Cycle=0,
        Speed=0,
        Collidable=false,
        Visible=true,
        isPlayer=false,
    }){
        for (var arg in arguments[0]) this[arg] = arguments[0][arg]

        this.id = Character.id

        let img_dir = Object.keys(arguments[0]).filter(i=>i.includes("Idle")).filter(i=>i.length>0)[0]
        this.Image = arguments[0][img_dir]
        this.Direction = img_dir ? img_dir.replace("Idle_", ""):"Down"
        this.ImgIndex = 0
        this.Animation_Cycle = Animation_Cycle
        this.Elapsed = 0
        this.Interaction = {unparsed: null, parsed: null, variables: {}}
        this.Map = null
        this.Progress = 0

        this.SavedObject = {}

        this.WanderDest = {x: 0, y: 0}
        this.WanderInterval
    }

    static restricted = [
        "Name",
        "id",
        "Interaction",
        "Progress",
        "Image",
    ]
}