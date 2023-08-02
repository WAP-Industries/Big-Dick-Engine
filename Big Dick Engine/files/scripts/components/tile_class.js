class Tile{

    static id = "Tile"

    constructor({
        Name="",
        Width=0,
        Height=0,
        Image="",
        Animation_Cycle=0,
        Collidable=false,
        Visible=true,
    }){

        for (var arg in arguments[0]) this[arg] = arguments[0][arg]

        this.id = Tile.id
        this.Elapsed = 0
        this.Animation_Cycle = Animation_Cycle
        this.ImgIndex = 0
        this.Map = null
    }
}