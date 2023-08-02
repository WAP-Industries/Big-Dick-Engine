class Lexer{
    static EvalExpr(expr, line, strexpr=false, runtime=false){
        let eval_expr = [expr, Lexer.ParseStrExpr(expr)][+strexpr]

        eval_expr = Lexer.ReplaceRef(eval_expr, strexpr)
        if (!eval_expr[0]) 
            return [Debugger.Error, Debugger.RunTimeError][+runtime](...(eval_expr[1]))
        
        eval_expr = Lexer.ReplaceVar(eval_expr, strexpr, runtime)
        if (!eval_expr[0])
            return [Debugger.Error, Debugger.RunTimeError][+runtime](...(eval_expr[1]))

        if (strexpr && !(line[0] in Keywords.declare))
            eval_expr = Lexer.ReplaceString(eval_expr)
        
        eval_expr = eval_expr.replaceAll("\uF480", "${").replaceAll("\uF481", "}")
        try{
            return (strexpr ? eval(`\`${eval_expr}\``):eval(eval_expr))
        }
        catch{
            let args = ["Syntax", "Invalid Syntax", line]
            return Debugger.Error(...args)
        }
    }

    static ParseStrExpr = (_expr)=>(
        _expr.replaceAll("~[", "\uF480").replaceAll("]~", "\uF481")
    )

    static ReplaceVar(_expr, strexpr, runtime){
        let var_ref = function(){
            let dic={global: [], local: []}
            for (let s=0;s<_expr.length;s++){
                if (_expr[s]=="$") dic.local.push(s)
                if (_expr[s]=="%") dic.global.push(s)
            }
            return dic
        }()

        return function(){
            let ref_arr={"global": [], "local": []}, expr =_expr
            let indexes = [], new_strings = []
            for (let scope in var_ref){
                for (let index of var_ref[scope]){
                    if (strexpr && !Lexer.WithinInterpolate(expr, index)) continue

                    let name = Parser.StripSpace(Lexer.GetANString(expr, index+1, 1)), val, type
                    let varcoll
                    let varsign = Object.keys(Keywords.Scopes)[(Object.values(Keywords.Scopes).map(i=>i.toLowerCase()).indexOf(scope))]

                    switch (scope){
                        case "local":
                            varcoll = System.oDialogue?.Interaction?.variables
                        break;
                        case "global":
                            varcoll = Keywords.Global_Variables
                        break
                    }
                    if (runtime){
                        let prop
                        if (name.includes(">>")){
                            [name, prop, val, type] = function(_name, _varcoll){
                                if (!(_name.includes(">>"))) return [_name, null]
                                let ptrname = _name.substring(0, _name.indexOf(">>"))
                                let ptrprop = _name.substring(_name.indexOf(">>")+2, _name.length)
                                if (_varcoll[ptrname]==undefined) return [ptrname].concat(Array(3).fill("no pointer"))
                                if (!Search_Char(_varcoll[ptrname].reference)) return [ptrname].concat(Array(3).fill("no character"))
                                let ptrvalue = Search_Char(_varcoll[ptrname].reference)?.[ptrprop]
                                if (strexpr && ptrvalue!=undefined)
                                    ptrvalue = ((typeof ptrvalue)=="number" ? `${ptrvalue}` : `\`${ptrvalue}\``)
                                return [ptrname, ptrprop, ptrvalue, typeof ptrvalue]
                            }(name, varcoll)
                            if (prop=="no pointer")
                                return [false, ["Reference", `${scope.replace(scope[0], scope[0].toUpperCase())} pointer ${name} does not exist`]]
                            if (prop=="no character")
                                return [false, ["Reference", `${scope.replace(scope[0], scope[0].toUpperCase())} pointer ${name} points to non-existent character.`]]
                            if (prop.replace(" ", "").length==0)
                                return [false, ["Syntax", "No property specified."]]
                            if (val==undefined) 
                                return [false, ["Reference", `Reference from ${scope} pointer ${name} does not contain property ${prop}`]]
                        }
                        if (varcoll[name]==undefined)
                            return [false, ["Reference", `${scope.replace(scope[0], scope[0].toUpperCase())} variable ${name} is not defined`]]

                        if (strexpr){
                            if (!prop)
                                val = (varcoll[name].type=="number" ? `${varcoll[name].value}` : `\`${varcoll[name].value}\``)
                            indexes.push([index-1, prop ? index+name.length+prop.length+">>".length:index+name.length])
                            new_strings.push(val)
                        }
                        else
                            ref_arr[scope].push([`${varsign}${name}${prop ? ">>"+prop:""}`, val || varcoll[name].value, type || varcoll[name].type])
                    }
                    else{
                        if (strexpr){
                            let substr = `${expr[index-1] ? expr[index-1]:""}${varsign}${name}`
                            indexes.push([expr.indexOf(substr), expr.indexOf(substr)+substr.length-1])
                            new_strings.push("1")
                        }
                        else 
                            ref_arr[scope].push([`${expr[index-1] ? expr[index-1]:""}${varsign}${name}`, "1"])
                    }
                }
            }
            
            if (strexpr)
                expr = Lexer.ReplaceSubString(expr, indexes, new_strings)
            else{
                for (let scope in ref_arr){
                    for (let pair of ref_arr[scope]){
                        let val = (runtime ? (pair[2]=="number" ? +pair[1]:`\`${pair[1].toString()}\``):pair[1])
                        expr = expr.replaceAll(pair[0], val)
                    }
                }
            }
            return expr
        }()
    }

    static ReplaceRef(_expr, strexpr){
        let obj_ref = function(){
            let arr = []
            for (let s=0;s<_expr.length;s++){
                if (_expr[s]==":" && _expr[s+1]==":")
                    arr.push(s)
            }
            return arr
        }()

        return function(){
            let ref_arr = [], expr=_expr
            let indexes=[], new_strings=[]

            for (let index of obj_ref){
                if (strexpr && !Lexer.WithinInterpolate(expr, index)) continue

                let name = Parser.StripSpace(Lexer.GetANString(expr, index-1, -1).split("").reverse().join(""))
                let char = System.render_list.Character.filter(i=>i.Name==name)[0]
                let prop = Parser.StripSpace(Lexer.GetANString(expr, index+2, 1))
                
                if (!char) return [false, ["Reference", "Non-existent Character Component"]]
                if (char[prop]==undefined) return [false, ["Reference", `Character Component property ${prop} does not exist`]]
                if (strexpr){
                    indexes.push([index-name.length-1, index+prop.length+1])
                    new_strings.push(char[prop])
                }
                else
                    ref_arr.push([`${name}::${prop}`, char[prop]])
            }


            if (strexpr)
                expr = Lexer.ReplaceSubString(expr, indexes, new_strings)
            else{
                for (let pair of ref_arr) 
                    expr = expr.replaceAll(pair[0], pair[1])
            }
            return expr
        }()
    }


    static ReplaceString(str){
        const CheckInterPolate = (char)=> (char=="\uF480" || char=="\uF481")
        const AddSubString = (i) =>{
            let substr = str.substring(i[0]+1, i[1]+1)
            if ((+substr).toString()!="NaN") return
                indexes.push(i)
            new_strings.push(FirstInterPolate(i[0]) ? `"${substr}"`:substr)
        }

        const FirstInterPolate = (i)=>{
            let index = Lexer.GetInterPolate(str, i, -1)
            return str[index]=="\uF480"
        }

        let substr = ""
        let indexes=[], new_strings = []
        for (let i=0;i<str.length;i++){
            if (/[+\-*\/\uF480\uF481()]/.exec(str[i])){
                if (substr[substr.length-1]!="`")
                    AddSubString([i-substr.length-1, i-1])
                substr = ""
                continue
            }
            if (!CheckInterPolate(str[i])) substr+=str[i]
            if (i==str.length-1 && substr[substr.length-1]!="`")
                AddSubString([i-substr.length, i])
        }

        return Lexer.ReplaceSubString(str, indexes, new_strings)
    }

    static ReplaceSubString(str, indexes, new_strings){
        let saved_str = str, new_str = str
        for (let s=0;s<new_strings.length;s++){
            indexes = indexes.map(i=>i = [i[0]+new_str.length-saved_str.length, i[1]+new_str.length-saved_str.length])
            saved_str = new_str

            let lstring = new_str.substring(0, indexes[s][0]+1)
            let rstring = new_str.substring(indexes[s][1]+1, new_str.length)
            new_str = `${lstring}${new_strings[s]}${rstring}`
        }
        return new_str
    }

    static WithinInterpolate(expr, index){
        let iStart = Lexer.GetInterPolate(expr, index-1, -1)
        let iEnd = Lexer.GetInterPolate(expr, index+2, 1)
        return (iStart!=null && iEnd!=null) 
    }

    static GetANString(str, start, inc){
        let res = ""
        for (let i=start;(inc>0 ? i<str.length:i>=0);i+=inc){
            if (/[+\-*\/\uF480\uF481()]/.exec(str[i])) return res
            res+=str[i]
        }
        return res
    }

    static GetInterPolate(str, start, inc){
        for (let i=start;(inc>0 ? i<str.length:i>=0);i+=inc){
            if (/[\uF480\uF481]/.exec(str[i])) return i
        }
        return null
    }
}