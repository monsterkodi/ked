var toExport = {}
var keys, parsed, r

import register from "../edit/register.js"

toExport["registers"] = async function ()
{
    await section("named and unnamed registers", async function ()
    {
        r = new register
        r.write('"',{lines:['one'],linewise:false},'yank')
        compare(r.read('"').lines,['one'])
        compare(r.read('0').lines,['one'])
        r.write('a',{lines:['aye'],linewise:false},'yank')
        compare(r.read('a').lines,['aye'])
        compare(r.read('"').lines,['aye'])
        compare(r.read('0').lines,['one'])
        r.write('A',{lines:['two'],linewise:true},'yank')
        compare(r.read('a').lines,['aye','two'])
    })
    await section("numbered registers", async function ()
    {
        r = new register
        r.write('a',{lines:['first'],linewise:true},'delete')
        compare(r.read('"').lines,['first'])
        compare(r.read('1').lines,['first'])
        r.write('b',{lines:['second'],linewise:true},'delete')
        compare(r.read('1').lines,['second'])
        compare(r.read('2').lines,['first'])
        r.write('x',{lines:['small'],linewise:false},'delete')
        compare(r.read('-').lines,['small'])
        compare(r.read('1').lines,['second'])
    })
    await section("black hole", async function ()
    {
        r = new register
        r.write('a',{lines:['keep'],linewise:true},'delete')
        r.write('_',{lines:['gone'],linewise:true},'delete')
        compare(r.read('"').lines,['keep'])
        compare(r.read('a').lines,['keep'])
        compare(r.read('1').lines,['keep'])
    })
    await section("macro registers", async function ()
    {
        r = new register
        keys = [{key:'x',combo:'x',char:'x'},{key:'return',combo:'return',char:'\n'}]
        r.setMacro('a',keys)
        compare(r.read('a').keys.length,2)
        compare(register.textForValue(r.read('a')),"x\n")
        r.setMacro('A',[{key:'j',combo:'j',char:'j'}])
        compare(r.read('a').keys.length,3)
        compare(register.textForValue(r.read('a')),"x\nj")
        parsed = register.keysForText("x<Esc>y")
        compare(parsed.length,3)
        compare(parsed[1].key,'esc')
    })
}
toExport["registers"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvcmVnaXN0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVksZUFBQTs7Ozs7O1FBTUosUUFBUTtRQUVSLEVBQUUsTUFBTSxLQUFNLE9BQVEsT0FBTyxTQUFVLE9BQVE7Z0JBRS9DLEVBQUUsS0FBSyxLQUFLLE9BQVU7Z0JBQ3RCLEVBQUUsS0FBSyxLQUFLLE9BQVU7UUFFdEIsRUFBRSxNQUFNLEtBQU0sT0FBUSxPQUFPLFNBQVUsT0FBUTtnQkFFL0MsRUFBRSxLQUFLLEtBQUssT0FBVTtnQkFDdEIsRUFBRSxLQUFLLEtBQUssT0FBVTtnQkFDdEIsRUFBRSxLQUFLLEtBQUssT0FBVTtRQUV0QixFQUFFLE1BQU0sS0FBTSxPQUFRLE9BQU8sU0FBVSxNQUFPO2dCQUU5QyxFQUFFLEtBQUssS0FBSyxPQUFVLE1BQU07Ozs7UUFJNUIsUUFBUTtRQUVSLEVBQUUsTUFBTSxLQUFNLE9BQVEsU0FBUyxTQUFVLE1BQU87Z0JBRWhELEVBQUUsS0FBSyxLQUFLLE9BQVU7Z0JBQ3RCLEVBQUUsS0FBSyxLQUFLLE9BQVU7UUFFdEIsRUFBRSxNQUFNLEtBQU0sT0FBUSxVQUFVLFNBQVUsTUFBTztnQkFFakQsRUFBRSxLQUFLLEtBQUssT0FBVTtnQkFDdEIsRUFBRSxLQUFLLEtBQUssT0FBVTtRQUV0QixFQUFFLE1BQU0sS0FBTSxPQUFRLFNBQVMsU0FBVSxPQUFRO2dCQUVqRCxFQUFFLEtBQUssS0FBSyxPQUFVO2dCQUN0QixFQUFFLEtBQUssS0FBSyxPQUFVOzs7O1FBSXRCLFFBQVE7UUFFUixFQUFFLE1BQU0sS0FBTSxPQUFRLFFBQVEsU0FBVSxNQUFPO1FBQy9DLEVBQUUsTUFBTSxLQUFNLE9BQVEsUUFBUSxTQUFVLE1BQU87Z0JBRS9DLEVBQUUsS0FBSyxLQUFLLE9BQVU7Z0JBQ3RCLEVBQUUsS0FBSyxLQUFLLE9BQVU7Z0JBQ3RCLEVBQUUsS0FBSyxLQUFLLE9BQVU7Ozs7UUFJdEIsUUFBUTtRQUVSLFNBQ08sSUFBSyxJQUFJLE1BQU8sSUFBSSxLQUFNLE1BQzFCLElBQUssU0FBUyxNQUFPLFNBQVMsS0FBTTtRQUUzQyxFQUFFLFNBQVMsSUFBSTtnQkFFZixFQUFFLEtBQUssS0FBSyxLQUFLLE9BQWdCO2dCQUNqQyxTQUFTLGFBQWEsRUFBRSxLQUFLLE1BQVc7UUFFeEMsRUFBRSxTQUFTLE1BQU8sSUFBSyxJQUFJLE1BQU8sSUFBSSxLQUFNO2dCQUU1QyxFQUFFLEtBQUssS0FBSyxLQUFLLE9BQWdCO2dCQUNqQyxTQUFTLGFBQWEsRUFBRSxLQUFLLE1BQVc7UUFFeEMsU0FBUyxTQUFTLFlBQVk7Z0JBRTlCLE9BQU8sT0FBMEI7Z0JBQ2pDLE9BQU8sR0FBRyxJQUF1QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/register.kode
