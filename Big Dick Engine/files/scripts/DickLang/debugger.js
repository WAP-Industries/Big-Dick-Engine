class Debugger{
    static patterns = [
        ["command"],
        ["command", "args"],
        ["sys", "character", "args"],
        ["sys", "character"],
        ["set", "env", "args"],
        ["declare", "type", "name", "args"]
    ]


    static FormPattern(line){
        let pattern = []
        for (let token in line){
            if (line[token] in Keywords.command && token==0) pattern.push("command")

            else if (line[token]=="set" && token==0) pattern.push("set")
            else if (line[token] in Keywords.env && pattern.includes("set") && token==1) pattern.push("env")

            else if (line[token] in Keywords.sys && token==0) pattern.push("sys")
            else if (pattern.length==1 && line[0] in Keywords.sys) pattern.push("character")

            else if (line[token] in Keywords.declare) pattern.push("declare")
            else if (Keywords.Variable_Types.includes(line[token]) && token==1) pattern.push("type")
            else if (pattern.includes("declare") && pattern.includes("type") && token==2) pattern.push("name")

            else pattern.push("args")
        }
        return pattern
    }


    static Error(type, error, line){
        alert(`Uncaught ${type}Error: ${error}\n${line.join(" 8=D ")}`)
        return null
    }


    static RunTimeError(type, error){
        Debugger.Error(type, error, System.oDialogue.Interaction.parsed[System.Progress][System.oDialogue.Progress])
        let c = System.oDialogue
        open_btn.click(); 
        [...map_container.childNodes].filter(i=>i.innerHTML.includes(System.Maps[Object.keys(System.Maps)[c.Map]].Name))[0].click()
        let div = Search_Editor(c.SavedObject)
        Edit_Properties(div.object, div)
        properties_container.scrollTop = properties_container.scrollHeight
    }

    static CheckExpr(line){
        if (!Debugger.FormPattern(line).includes("args")) return
        let index = (line[0] in Keywords.sys ? 2:(line[0] in Keywords.command ? 1:(line[0] in Keywords.declare ? 3:2)))
        let args = line[index].split("<>").map(i=>Parser.StripSpace(i))
        let argtypes = Keywords[Debugger.FormPattern(line)[0]][line[0]].info.args

        if (argtypes.includes("*") && !(line[0] in Keywords.declare)) return args
        for (let arg of args) {
            let strexpr = line[0] in Keywords.declare ? line[1]!="number":argtypes[args.indexOf(arg)]!="number"
            if (Lexer.EvalExpr(arg, line, strexpr)==null) return false
            args[args.indexOf(arg)] = Lexer.EvalExpr(arg, line, strexpr)
        }
        return args
    }


    static Debug(token_dic){
        for (let index in token_dic){
            for (let line of token_dic[index]){
                let pattern = Debugger.FormPattern(line)

                if (!Debugger.CheckPattern(pattern)) 
                    return Debugger.Error("Syntax", "Invalid Syntax", line)

                if (line[1] in Keywords.env && !Debugger.CheckEnv(line[1], line[2])) 
                    return Debugger.Error("Type", "Type mismatch between environment variable and argument", line)
                if (line[1] in Keywords.env) continue

                if (
                    line[0] in Keywords.sys &&
                    Keywords[(line[0] in Keywords.sys ? "sys":"command")][line[0]].info.args.length>0 &&
                    !pattern.includes("args") && !Keywords[(line[0] in Keywords.sys ? "sys":"command")][line[0]].info.args.includes("*")
                ) return Debugger.Error("Type", `Expected ${Keywords[(line[0] in Keywords.sys ? "sys":"command")][line[0]].info.args.length} arguments`, line)

                if (pattern.includes("character") && !Debugger.GetChar(line[pattern.indexOf("character")], line, 0)) 
                    return Debugger.Error("Reference", "Non-existent Character Component", line)

                if (pattern.includes("args")){
                    let args = Debugger.CheckExpr(line)
                    if (!args) return
                    if (line[0] in Keywords.declare && !Debugger.CheckVariable(line[0], line[1], line[2], args[0], line))
                        return
                    else if (!Debugger.CheckArgument(Keywords[pattern[0]][line[0]].info.args, args.join("<>"),line))
                        return
                }
            }
        }
        return true
    }

    static GetChar(name, line, mode=0){
        if (/[%$]/.exec(name[0])){
            if (!mode) return true

            switch (name[0]){
                case "$":
                    var char = System.oDialogue.Interaction.variables[name.substring(1, name.length)]
                break;
                case "%":
                    var char = Keywords.Global_Variables[name.substring(1, name.length)]
                break;
            }
            return (Search_Char(char?.reference)?.Name ??  
                Debugger.RunTimeError("Reference", `${Keywords.Scopes[name[0]]} pointer ${name.substring(1, name.length)} does not exist`)
            )
        }
        else
            return Search_Char(name)?.Name
    }

    static CheckPattern = (pattern)=>(Debugger.patterns.some(p=>p.join()==pattern.join()))


    static CheckVariable(scope, type, name, value, line){
        if (name.includes(" "))
            return Debugger.Error("Syntax", "Whitespace not allowed in variable name", line)
        if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(name))
            return Debugger.Error("Syntax", "Variable name cannot contain special characters", line)
        if (!(/[a-z]/i.exec(name[0])))
            return Debugger.Error("Syntax", "Variable name cannot start with numeric character", line)

        if (type=="string") return value
        if (type=="number") 
            return ((+value).toString()=="NaN" ? Debugger.Error("Type", "Type mismatch between variable and value", line):+value)
        if (type=="pointer")
            return (Search_Char(value) ? true:Debugger.Error("Reference", "Non-existent Character Component", []))
    }


    static CheckArgument(argslist, _args, line){
        if (argslist.includes("*")) return true

        let args = _args.split("<>")

        if (argslist.length!=args.length) return Debugger.Error("Type", `Expected ${argslist.length} arguments`, line)

        args = args.map(arg=>
            argslist[args.indexOf(arg)]=="number" ? 
            ((arg).toString()!="NaN" ? "number":"string"):
            (argslist[args.indexOf(arg)]=="boolean" ? (arg=="true" || arg=="false" ? "boolean":"string"):"string")   
        )

        if (args.join()!=argslist.join()) return Debugger.Error("Type", "Invalid argument type", line)

        return true
    }

    static CheckEnv = (env, value)=>(
        Keywords.env[env].arg==(Keywords.env[env].arg=="number" ? ((+value).toString()!="NaN" ? "number":"string"):"string")
    )

    static GetArgType = (property, arg)=>{
        let pType = Array.isArray(property) ? "array" : typeof property
        if (pType=="string") return arg
        switch (pType){
            case "number":
                return (+arg).toString()=="NaN" ? null:+arg
            break;
            case "array":
                return arg.split(",").map(i=> Parser.StripSpace(i))
            break;
            case "boolean":
                return ((arg=="true" || arg=="false") ? JSON.parse(arg):null)
            break;
        }
    }
}
