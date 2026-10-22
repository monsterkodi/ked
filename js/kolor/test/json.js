var toExport = {}
var rgs

import util from "./util.js"
let ranges = util.ranges
let inc = util.inc
let lang = util.lang

lang('json')
toExport["json"] = async function ()
{
    rgs = ranges(`{ "A Z": 1 }`)
    compare(inc(rgs,2,'"'),'punct dictionary')
    compare(inc(rgs,3,'A'),'dictionary key')
    compare(inc(rgs,5,'Z'),'dictionary key')
    compare(inc(rgs,6,'"'),'punct dictionary')
    compare(inc(rgs,7,':'),'punct dictionary')
    rgs = ranges('"a": "http://domain.com"')
    inc(rgs,6,'http','url p    ▸ rotocol')
    compare(inc(rgs,10,':'),'punct url')
    compare(inc(rgs,11,'/'),'punct url')
    compare(inc(rgs,12,'/'),'punct url')
    compare(inc(rgs,13,'domain'),'url domain')
    compare(inc(rgs,19,'.'),'punct url tld')
    compare(inc(rgs,20,'com'),'url tld')
    rgs = ranges('"http://domain.com/dir/page.html"')
    compare(inc(rgs,1,'http'),'url protocol')
    compare(inc(rgs,5,':'),'punct url')
    compare(inc(rgs,6,'/'),'punct url')
    compare(inc(rgs,7,'/'),'punct url')
    compare(inc(rgs,8,'domain'),'url domain')
    compare(inc(rgs,14,'.'),'punct url tld')
    compare(inc(rgs,15,'com'),'url tld')
    compare(inc(rgs,18,'/'),'punct dir')
    rgs = ranges('"file.coffee"')
    compare(inc(rgs,1,'file'),'string double')
    compare(inc(rgs,5,'.'),'string double')
    compare(inc(rgs,6,'coffee'),'string double')
    rgs = ranges('"/some/path"')
    compare(inc(rgs,2,'some'),'text dir')
    compare(inc(rgs,6,'/'),'punct dir')
    compare(inc(rgs,7,'path'),'text file')
    rgs = ranges('"/some\\path/file.txt:10"')
    compare(inc(rgs,0,'"'),'punct string double')
    compare(inc(rgs,1,'/'),'punct dir')
    compare(inc(rgs,2,'some'),'text dir')
    compare(inc(rgs,16,'.'),'string double')
    compare(inc(rgs,20,':'),'string double')
    compare(inc(rgs,23,'"'),'punct string double')
    rgs = ranges('"./node_modules/.bin/mocha"')
    compare(inc(rgs,1,'.'),'text dir')
    compare(inc(rgs,2,'/'),'punct dir')
    compare(inc(rgs,3,'node_modules'),'text dir')
    compare(inc(rgs,15,'/'),'punct dir')
    compare(inc(rgs,16,'.'),'text dir')
    compare(inc(rgs,17,'bin'),'text dir')
    compare(inc(rgs,20,'/'),'punct dir')
    compare(inc(rgs,21,'mocha'),'text file')
    rgs = ranges('"66.70.0"')
    compare(inc(rgs,1,"66"),'semver')
    compare(inc(rgs,3,"."),'punct semver')
    compare(inc(rgs,4,"70"),'semver')
    compare(inc(rgs,6,"."),'punct semver')
    compare(inc(rgs,7,"0"),'semver')
    rgs = ranges('"^0.7.1"')
    compare(inc(rgs,1,"^"),'punct semver')
    compare(inc(rgs,2,"0"),'semver')
    compare(inc(rgs,4,"7"),'semver')
    compare(inc(rgs,6,"1"),'semver')
    rgs = ranges('"^1.0.0-alpha.12"')
    compare(inc(rgs,2,"1"),'semver')
    compare(inc(rgs,4,"0"),'semver')
    compare(inc(rgs,6,"0"),'semver')
    rgs = ranges('">=6.7.8"')
    compare(inc(rgs,1,">"),'punct semver')
    compare(inc(rgs,2,"="),'punct semver')
    compare(inc(rgs,3,"6"),'semver')
    compare(inc(rgs,4,"."),'punct semver')
    compare(inc(rgs,5,"7"),'semver')
    compare(inc(rgs,6,"."),'punct semver')
    compare(inc(rgs,7,"8"),'semver')
}
toExport["json"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2xvci90ZXN0L2pzb24ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BUU0sV0FBQTtJQUFPO0lBQU87SUFBSTs7QUFFeEIsS0FBSzs7O0lBVUQsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7SUFFOUIsTUFBTSxPQUFPO0lBQ2IsSUFBSSxJQUFLLEVBQUUsT0FBTztZQUNsQixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxVQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxPQUFrQjtJQUU5QixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxRQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxVQUFtQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxPQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtJQU05QixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxRQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxVQUFtQjtJQUU5QixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxRQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxRQUFtQjtJQUU5QixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssRUFBRyxRQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtZQUM5QixJQUFJLElBQUssR0FBRyxLQUFrQjtJQUU5QixNQUFNLE9BQU87WUFDYixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxLQUFtQjtZQUM5QixJQUFJLElBQUssRUFBRSxnQkFBbUI7WUFDOUIsSUFBSSxJQUFLLEdBQUcsS0FBa0I7WUFDOUIsSUFBSSxJQUFLLEdBQUcsS0FBa0I7WUFDOUIsSUFBSSxJQUFLLEdBQUcsT0FBa0I7WUFDOUIsSUFBSSxJQUFLLEdBQUcsS0FBa0I7WUFDOUIsSUFBSSxJQUFLLEdBQUcsU0FBa0I7SUFFOUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsTUFBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsTUFBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7SUFFOUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7SUFFOUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7SUFFOUIsTUFBTSxPQUFPO1lBQ2IsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUI7WUFDOUIsSUFBSSxJQUFLLEVBQUUsS0FBbUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/test/json.kode
