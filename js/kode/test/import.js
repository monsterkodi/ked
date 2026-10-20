var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["import"] = async function ()
{
    compare(kc('import noon from "noon"'),'import noon from "noon"')
    compare(kc('import defaultExport from "module"'),'import defaultExport from "module"')
    compare(kc('import * as name from "module"'),'import * as name from "module"')
    compare(kc('import { export1 } from "module"'),'import { export1 } from "module"')
    compare(kc('import { export1 as alias1 } from "module"'),'import { export1 as alias1 } from "module"')
    compare(kc('import { default as alias } from "module"'),'import { default as alias } from "module"')
    compare(kc('import { export1, export2 } from "module"'),'import { export1 , export2 } from "module"')
    compare(kc('import { export1, export2 as alias2 } from "module"'),'import { export1 , export2 as alias2 } from "module"')
    compare(kc('import { "string name" as alias } from "module"'),'import { "string name" as alias } from "module"')
    compare(kc('import defaultExport, { export1 } from "module"'),'import defaultExport , { export1 } from "module"')
    compare(kc('import defaultExport, * as name from "module"'),'import defaultExport , * as name from "module"')
    compare(kc('import("f").then((a) -> a())'),`import("f")
.
then(function (a)
{
    return a()
})`)
    compare(kc('import.meta.url'),'import.meta.url')
    compare(kc('import patterns from "./lexer.json" assert {type:"json"}'),'import patterns from "./lexer.json" assert { type : "json" }')
    compare(kc(`import a from 'a'
import b from './b'`),`import a from 'a'
import b from './b'`)
    compare(kc('d = { import:1 }'),'d = {import:1}')
}
toExport["import"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9pbXBvcnQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQVlJLEdBQUcsMkJBQTBEO1lBQzdELEdBQUcsc0NBQTBEO1lBQzdELEdBQUcsa0NBQTBEO1lBQzdELEdBQUcsb0NBQTBEO1lBQzdELEdBQUcsOENBQTBEO1lBQzdELEdBQUcsNkNBQTBEO1lBQzdELEdBQUcsNkNBQTBEO1lBQzdELEdBQUcsdURBQTBEO1lBQzdELEdBQUcsbURBQTBEO1lBQzdELEdBQUcsbURBQTBEO1lBQzdELEdBQUcsaURBQTBEO1lBQzdELEdBQUcsZ0NBQTBEOzs7Ozs7WUFTN0QsR0FBRyxtQkFBb0I7WUFDdkIsR0FBRyw0REFBNkQ7WUFDaEUsR0FBSTtzQkFJQTs7WUFLSixHQUFHLG9CQUFxQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/import.kode
