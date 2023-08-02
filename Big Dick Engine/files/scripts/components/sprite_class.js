class Sprite {

    static id = "Sprite"

    constructor({
        Name="",
        Width=0,
        Height=0,
        Image=[],
        Animation_Cycle=0,
        Collidable=false,
        Visible=true,
    }){

        for (var arg in arguments[0]) this[arg] = arguments[0][arg]

        this.id = Sprite.id
        this.ImgIndex = 0
        this.Elapsed = 0
        this.Map = null

    }
}