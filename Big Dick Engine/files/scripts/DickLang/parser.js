class Parser{
    static GetAlphaNum(str, start, end){
        let i=start;
        if (/[\S]/.exec(str[start])) return start
        while ((start>end ? i>=end:i<=end)) {
            if (/[\S]/.exec(str[i])) return i
            i+=(start>end ? -1:1);
        }
    }

    static StripSpace(string){
        let aFirst = Parser.GetAlphaNum(string, 0, string.length-1)
        let aLast = Parser.GetAlphaNum(string, string.length-1, 0)
        return string.substring(aFirst, aLast+1)
    }


    static Parse(code){
        let groups = code.replace(/\n/gm, "\t").split("8=====D").filter(string=>string!="")

        let token_dic = {}
        for (let i of groups.map(string=> [groups.indexOf(string), string]))
            token_dic[i[0]] = i[1].split("\t").filter(token=>token!="").map(token=>token.split("8=D").map(token=>Parser.StripSpace(token)))

        return token_dic
    }
}