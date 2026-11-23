var toExport = {}
var i, rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges

toExport["strings"] = async function ()
{
    rgs = ranges("slash = require 'kslash'")
    compare(inc(rgs,16,"'"),'punct require')
    compare(inc(rgs,17,"kslash"),'text require')
    compare(inc(rgs,23,"'"),'punct require')
    rgs = ranges('a="\'X\'"')
    compare(inc(rgs,2,'"'),'punct string double')
    compare(inc(rgs,3,"'"),'string double')
    compare(inc(rgs,4,"X"),'string double')
    compare(inc(rgs,6,'"'),'punct string double')
    rgs = ranges('a=\'"X"\'','coffee')
    compare(inc(rgs,2,"'"),'punct string single')
    compare(inc(rgs,3,'"'),'string single')
    compare(inc(rgs,4,'X'),'string single')
    compare(inc(rgs,6,"'"),'punct string single')
    rgs = ranges('a="  \'X\'  Y  " ')
    compare(inc(rgs,2,'"'),'punct string double')
    compare(inc(rgs,5,"'"),'string double')
    compare(inc(rgs,6,"X"),'string double')
    compare(inc(rgs,7,"'"),'string double')
    compare(inc(rgs,13,'"'),'punct string double')
    rgs = ranges('a="";b=" ";c="X"')
    var list = [2,3,7,9,13,15]
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        i = list[_a_]
        compare(inc(rgs,i,'"'),'punct string double')
    }
    compare(inc(rgs,14,'X'),'string double')
    rgs = ranges("a='';b=' ';c='Y'")
    var list1 = [2,3,7,9,13,15]
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        i = list1[_b_]
        compare(inc(rgs,i,"'"),'punct string single')
    }
    compare(inc(rgs,14,'Y'),'string single')
    rgs = ranges('"s = \'/some\\path/file.txt:10\'"')
    compare(inc(rgs,5,"'"),'string double')
    compare(inc(rgs,17,"file"),'string double')
    compare(inc(rgs,21,"."),'string double')
    compare(inc(rgs,22,"txt"),'string double')
    compare(inc(rgs,26,"10"),'string double')
    compare(inc(rgs,28,"'"),'string double')
    compare(inc(rgs,29,'"'),'punct string double')
    rgs = ranges("when '\"\"\"' then 'string double triple'")
    compare(inc(rgs,6,'"'),'string single')
    compare(inc(rgs,7,'"'),'string single')
    compare(inc(rgs,8,'"'),'string single')
    await section("interpolation", async function ()
    {
        rgs = ranges('"#{xxx}"')
        compare(inc(rgs,0,'"'),'punct string double')
        compare(inc(rgs,1,"#"),'punct string interpolation')
        compare(inc(rgs,2,"{"),'punct string interpolation')
        compare(inc(rgs,3,'xxx'),'text')
        compare(inc(rgs,6,"}"),'punct string interpolation')
        compare(inc(rgs,7,'"'),'punct string double')
        rgs = ranges('"#{666}"')
        compare(inc(rgs,0,'"'),'punct string double')
        compare(inc(rgs,3,'666'),'number')
        compare(inc(rgs,7,'"'),'punct string double')
        rgs = ranges('"""#{777}"""')
        compare(inc(rgs,0,'"'),'punct string triple')
        compare(inc(rgs,1,'"'),'punct string triple')
        compare(inc(rgs,2,'"'),'punct string triple')
        compare(inc(rgs,3,'#'),'punct string interpolation')
        compare(inc(rgs,4,'{'),'punct string interpolation')
        compare(inc(rgs,5,'777'),'number')
        compare(inc(rgs,8,'}'),'punct string interpolation')
        compare(inc(rgs,9,'"'),'punct string triple')
        compare(inc(rgs,10,'"'),'punct string triple')
        compare(inc(rgs,11,'"'),'punct string triple')
        rgs = ranges('"""a#{xxx}b"""')
        compare(inc(rgs,3,'a'),'string triple')
        compare(inc(rgs,4,'#'),'punct string interpolation')
        compare(inc(rgs,5,'{'),'punct string interpolation')
        compare(inc(rgs,6,'xxx'),'text')
        compare(inc(rgs,9,'}'),'punct string interpolation')
        compare(inc(rgs,10,'b'),'string triple')
        rgs = ranges('\'\'\'')
        compare(inc(rgs,0,"'"),'punct string single')
        compare(inc(rgs,1,"'"),'punct string single')
        compare(inc(rgs,2,"'"),'punct string single')
        rgs = ranges('\'\'\'#{777}\'\'\'')
        compare(inc(rgs,3,'#'),'string single')
        compare(inc(rgs,4,'{'),'string single')
        compare(inc(rgs,5,'777'),'string single')
        compare(inc(rgs,8,'}'),'string single')
        rgs = ranges('"#{__dirname}/../"')
        compare(inc(rgs,12,'}'),'punct string interpolation')
        compare(inc(rgs,13,'/'),'string double')
        rgs = ranges("p = 'c:\\\\path\\\\'; 1")
        compare(inc(rgs,4,"'"),'punct string single')
        compare(inc(rgs,5,"c"),'string single')
        compare(inc(rgs,6,":"),'string single')
        compare(inc(rgs,7,"\\"),'string single')
        compare(inc(rgs,8,"\\"),'string single')
        compare(inc(rgs,9,"path"),'string single')
        compare(inc(rgs,13,"\\"),'string single')
        compare(inc(rgs,14,"\\"),'string single')
        compare(inc(rgs,15,"'"),'punct string single')
        compare(inc(rgs,16,";"),'punct minor')
        compare(inc(rgs,18,"1"),'number')
        rgs = ranges('a="\\"X\\""')
        compare(inc(rgs,2,'"'),'punct string double')
        compare(inc(rgs,3,'\\'),'string double')
        compare(inc(rgs,4,'"'),'string double')
        compare(inc(rgs,5,'X'),'string double')
        compare(inc(rgs,6,'\\'),'string double')
        compare(inc(rgs,7,'"'),'string double')
        compare(inc(rgs,8,'"'),'punct string double')
    })
}
toExport["strings"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2xvci90ZXN0L3N0cmluZ3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ00sV0FBQTtJQUFPO0lBQUk7Ozs7SUFJYixNQUFNLE9BQU87SUFDVyxRQUF4QixJQUFJLElBQUssR0FBRyxLQUFjO0lBQ0YsUUFBeEIsSUFBSSxJQUFLLEdBQUcsVUFBYztJQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLEtBQWM7SUFFMUIsTUFBTSxPQUFPO0lBQ1csUUFBeEIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUNGLFFBQXhCLElBQUksSUFBSyxFQUFFLEtBQWU7SUFDRixRQUF4QixJQUFJLElBQUssRUFBRSxLQUFlO0lBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUUxQixNQUFNLE9BQU8sWUFBWTtJQUNELFFBQXhCLElBQUksSUFBSyxFQUFFLEtBQWU7SUFDRixRQUF4QixJQUFJLElBQUssRUFBRSxLQUFlO0lBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUNGLFFBQXhCLElBQUksSUFBSyxFQUFFLEtBQWU7SUFFMUIsTUFBTSxPQUFPO0lBQ1csUUFBeEIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUNGLFFBQXhCLElBQUksSUFBSyxFQUFFLEtBQWU7SUFDRixRQUF4QixJQUFJLElBQUssRUFBRSxLQUFlO0lBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLEtBQWM7SUFFMUIsTUFBTSxPQUFPO2dCQUNILEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRzs7O1FBQWpCO1FBQ29CLFFBQXBCLElBQUksSUFBSyxFQUFHLEtBQVU7O0lBQ0YsUUFBeEIsSUFBSSxJQUFLLEdBQUcsS0FBYztJQUUxQixNQUFNLE9BQU87aUJBQ0gsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHOzs7UUFBakI7UUFDb0IsUUFBcEIsSUFBSSxJQUFLLEVBQUcsS0FBVTs7SUFDRixR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
//# sourceURL=../../../kode/kolor/test/strings.kode
