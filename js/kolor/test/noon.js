var toExport = {}
var rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges
let lang = util.lang

lang('noon')
toExport["noon"] = function ()
{
    rgs = ranges("    property  value")
    compare(inc(rgs,4,'property'),'property')
    compare(inc(rgs,14,'value'),'text')
    rgs = ranges("top",'noon')
    compare(inc(rgs,0,'top'),'obj')
    rgs = ranges("tip top")
    compare(inc(rgs,0,'tip'),'obj')
    compare(inc(rgs,4,'top'),'obj')
    rgs = ranges("top  prop")
    compare(inc(rgs,0,'top'),'obj')
    compare(inc(rgs,5,'prop'),'text')
    rgs = ranges("version  ^0.1.2")
    compare(inc(rgs,0,'version'),'obj')
    compare(inc(rgs,9,'^'),'punct semver')
    compare(inc(rgs,10,'0'),'semver')
    rgs = ranges("    some-package-name  1")
    compare(inc(rgs,4,'some'),'property')
    compare(inc(rgs,9,'package'),'property')
    compare(inc(rgs,17,'name'),'property')
    rgs = ranges("    some-package-name  ^1.2.3")
    compare(inc(rgs,4,'some'),'property')
    compare(inc(rgs,9,'package'),'property')
    compare(inc(rgs,17,'name'),'property')
    rgs = ranges("top  prop  value")
    compare(inc(rgs,0,'top'),'obj')
    compare(inc(rgs,5,'prop'),'property')
    compare(inc(rgs,11,'value'),'text')
    rgs = ranges("    http://domain.com")
    compare(inc(rgs,4,'http'),'url protocol')
    compare(inc(rgs,8,':'),'punct url')
    compare(inc(rgs,9,'/'),'punct url')
    compare(inc(rgs,10,'/'),'punct url')
    compare(inc(rgs,11,'domain'),'url domain')
    compare(inc(rgs,17,'.'),'punct url tld')
    compare(inc(rgs,18,'com'),'url tld')
    rgs = ranges("    http://domain.com/dir/page.html")
    compare(inc(rgs,4,'http'),'url protocol')
    compare(inc(rgs,8,':'),'punct url')
    compare(inc(rgs,9,'/'),'punct url')
    compare(inc(rgs,10,'/'),'punct url')
    compare(inc(rgs,11,'domain'),'url domain')
    compare(inc(rgs,17,'.'),'punct url tld')
    compare(inc(rgs,18,'com'),'url tld')
    compare(inc(rgs,21,'/'),'punct dir')
    rgs = ranges("    file.coffee")
    compare(inc(rgs,4,'file'),'coffee file')
    compare(inc(rgs,8,'.'),'punct coffee')
    compare(inc(rgs,9,'coffee'),'coffee ext')
    rgs = ranges("    /some/path")
    compare(inc(rgs,5,'some'),'text dir')
    compare(inc(rgs,9,'/'),'punct dir')
    compare(inc(rgs,10,'path'),'text file')
    rgs = ranges('    /some\\path/file.txt:10')
    compare(inc(rgs,4,'/'),'punct dir')
    compare(inc(rgs,5,'some'),'text dir')
    compare(inc(rgs,9,'\\'),'punct dir')
    compare(inc(rgs,19,'.'),'punct txt')
    compare(inc(rgs,23,':'),'punct')
    rgs = ranges("    test  ./node_modules/.bin/mocha")
    compare(inc(rgs,4,'test'),'property')
    compare(inc(rgs,10,'.'),'punct dir')
    compare(inc(rgs,11,'/'),'punct dir')
    compare(inc(rgs,12,'node_modules'),'text dir')
    compare(inc(rgs,24,'/'),'punct dir')
    compare(inc(rgs,25,'.'),'punct dir')
    compare(inc(rgs,26,'bin'),'text dir')
    compare(inc(rgs,29,'/'),'punct dir')
    compare(inc(rgs,30,'mocha'),'text file')
    section("comments", function ()
    {
        rgs = ranges("   # bla blub")
        compare(inc(rgs,3,"#"),'punct comment')
        compare(inc(rgs,5,"bla"),'comment')
        compare(inc(rgs,9,"blub"),'comment')
    })
}
toExport["noon"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2xvci90ZXN0L25vb24ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFVQSxLQUFLOzs7SUFJRCxNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxZQUFlO1lBQzFCLElBQUksSUFBSyxHQUFHLFNBQWM7SUFFMUIsTUFBTSxPQUFPLE1BQU07WUFDbkIsSUFBSSxJQUFLLEVBQUUsT0FBZTtJQUUxQixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxPQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLE9BQWU7SUFFMUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsT0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxRQUFlO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLFdBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFHLFFBQWM7WUFDMUIsSUFBSSxJQUFLLEVBQUcsV0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxRQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFHLFFBQWM7WUFDMUIsSUFBSSxJQUFLLEVBQUcsV0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxRQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFHLE9BQWM7WUFDMUIsSUFBSSxJQUFLLEVBQUcsUUFBYztZQUMxQixJQUFJLElBQUssR0FBRyxTQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLFFBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsVUFBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLE9BQWM7SUFFMUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsUUFBZTtZQUMxQixJQUFJLElBQUssRUFBRSxLQUFlO1lBQzFCLElBQUksSUFBSyxFQUFFLEtBQWU7WUFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxVQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsT0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLFFBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssRUFBRSxVQUFlO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFFLFFBQWU7WUFDMUIsSUFBSSxJQUFLLEVBQUUsS0FBZTtZQUMxQixJQUFJLElBQUssR0FBRyxRQUFjO0lBRTFCLE1BQU0sT0FBTztZQUNiLElBQUksSUFBSyxFQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEVBQUcsUUFBYztZQUMxQixJQUFJLElBQUssRUFBRyxNQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztJQUUxQixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxRQUFlO1lBQzFCLElBQUksSUFBSyxHQUFHLEtBQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxnQkFBaUI7WUFDN0IsSUFBSSxJQUFLLEdBQUcsS0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxLQUFjO1lBQzFCLElBQUksSUFBSyxHQUFHLE9BQWM7WUFDMUIsSUFBSSxJQUFLLEdBQUcsS0FBYztZQUMxQixJQUFJLElBQUssR0FBRyxTQUFjOzs7UUFJdEIsTUFBTSxPQUFPO2dCQUNiLElBQUksSUFBSyxFQUFFLEtBQVc7Z0JBQ3RCLElBQUksSUFBSyxFQUFFLE9BQVc7Z0JBQ3RCLElBQUksSUFBSyxFQUFFLFFBQVcifQ==
//# sourceURL=file://kode/kolor/test/noon.kode
