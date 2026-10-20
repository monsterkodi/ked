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
        compare(inc(rgs,3,'#'),'string triple')
        compare(inc(rgs,4,'{'),'string triple')
        compare(inc(rgs,5,'777'),'string triple')
        compare(inc(rgs,8,'}'),'string triple')
        compare(inc(rgs,9,'"'),'punct string triple')
        compare(inc(rgs,10,'"'),'punct string triple')
        compare(inc(rgs,11,'"'),'punct string triple')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2xvci90ZXN0L3N0cmluZ3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JJLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxHQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsVUFBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLEtBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLEtBQWU7SUFFMUIsTUFBTSxPQUFPLFlBQVk7WUFDekIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLEtBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtJQUUxQixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLEtBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7SUFFMUIsTUFBTSxPQUFPO2dCQUNILEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRzs7OztnQkFDakIsSUFBSSxJQUFLLEVBQUcsS0FBVTs7WUFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztJQUUxQixNQUFNLE9BQU87aUJBQ0gsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHOzs7O2dCQUNqQixJQUFJLElBQUssRUFBRyxLQUFVOztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLEtBQWU7WUFDMUIsSUFBSSxJQUFLLEdBQUcsUUFBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLE9BQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsTUFBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7SUFFMUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLEtBQWU7OztRQUl0QixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsT0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtRQUUxQixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsT0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtRQVExQixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsT0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztRQUUxQixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEdBQUksS0FBYTtnQkFDMUIsSUFBSSxJQUFLLEdBQUksS0FBYTtRQUUxQixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsS0FBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsTUFBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsTUFBYztnQkFDMUIsSUFBSSxJQUFLLEVBQUcsUUFBYztnQkFDMUIsSUFBSSxJQUFLLEdBQUksTUFBYTtnQkFDMUIsSUFBSSxJQUFLLEdBQUksTUFBYTtnQkFDMUIsSUFBSSxJQUFLLEdBQUksS0FBYTtnQkFDMUIsSUFBSSxJQUFLLEdBQUksS0FBYTtnQkFDMUIsSUFBSSxJQUFLLEdBQUksS0FBYTtRQUUxQixNQUFNLE9BQU87Z0JBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsTUFBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsTUFBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtnQkFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/test/strings.kode
