class Door{

    static id = "Door"

    constructor({
        Image=[],
        Width=0, 
        Height=0,
        Target="",
        Animation_Cycle=0,
        Collidable=false,
        Visible=true,
    }){

        for (var arg in arguments[0]) this[arg] = arguments[0][arg]

        this.ImgIndex = 0
        this.Elapsed = 0
        this.id = Door.id
        this.Map = null

    }

}