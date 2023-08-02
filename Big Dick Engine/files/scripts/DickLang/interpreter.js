class Interpreter{
    static GetArgs(line, argstring){
        let args = argstring.split("<>")
        let argtypes = Keywords[Debugger.FormPattern(line)[0]][line[0]].info.args

        if (argtypes.includes("*")) return args
        for (let arg of args) {
            args[args.indexOf(arg)] = Lexer.EvalExpr(arg, line, argtypes[args.indexOf(arg)]=="string", true)
        }
        return args
    }

    static Skip(){
        if (!System.oDialogue || System.oDialogue.Interaction.parsed[System.Progress][System.oDialogue.Progress+1]==undefined) return
            System.oDialogue.Progress++
        Interpreter.Run(System.oDialogue.Interaction.parsed[System.Progress][System.oDialogue.Progress])
    }

    static Run(tokens){
        if (tokens[0] in Keywords.sys)
            Keywords.sys[tokens[0]].func(Debugger.GetChar(tokens[1], tokens, 1), 
                ...Debugger.FormPattern(tokens).includes("args") ? Interpreter.GetArgs(tokens, tokens[2]) : [])
        if (tokens[0] in Keywords.command)
            Keywords.command[tokens[0]].func(
                ...Debugger.FormPattern(tokens).includes("args") ? Interpreter.GetArgs(tokens, tokens[1]) : [])
        if (tokens[0] in Keywords.declare)
            Keywords.declare[tokens[0]].func(
                tokens[1], tokens[2], 
                Lexer.EvalExpr(tokens[1]=="pointer" ? "{...}":tokens[3], tokens, tokens[1]!="number", true),
                tokens[1]=="pointer" ? tokens[3]:undefined
            )
        if (tokens[1] in Keywords.env){
            Keywords.env[tokens[1]].func(tokens[2])
            Interpreter.Skip()
        }
    }
}