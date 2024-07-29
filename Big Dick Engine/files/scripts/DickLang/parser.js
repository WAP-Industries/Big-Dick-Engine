class Parser{
    static StripSpace(string){
        return string.trim()
    }

    static Parse(code){
        let groups = code.replace(/\n/gm, "\t").split("8=====D").filter(string=>string!="")

        let token_dic = {}
        for (let i of groups.map(string=> [groups.indexOf(string), string]))
            token_dic[i[0]] = i[1].split("\t").filter(token=>token!="").map(token=>token.split("8=D").map(token=>Parser.StripSpace(token)))

        return token_dic
    }
}