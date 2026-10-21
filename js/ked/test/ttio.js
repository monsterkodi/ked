var toExport = {}
var keys, seqs, t

import ttio from "../view/screen/ttio.js"

toExport["ttio"] = async function ()
{
    await section("a headless ttio has no cells", async function ()
    {
        t = new ttio({headless:true,input:false})
        compare(t.cellsz,[])
    })
    await section("a csi sequence ends with its final byte", async function ()
    {
        t = new ttio({headless:true,input:false})
        seqs = t.parseData(Buffer.from('\x1b[B\r'))
        compare(seqs.length,2)
        compare(seqs[0].csi,'B')
        compare(seqs[1].raw,'\r')
    })
    await section("a sequence that is not a csi one ends where the next escape is", async function ()
    {
        seqs = t.parseData(Buffer.from('\x1bOP\x1b[B'))
        compare(seqs.length,2)
        compare(seqs[0].esc,'OP')
        compare(seqs[1].csi,'B')
    })
    await section("the keys of a chunk are keys of their own", async function ()
    {
        keys = []
        t.on('key',function (combo)
        {
            return keys.push(combo)
        })
        t.onData(Buffer.from('\x1b[B\x1b[B\r'))
        compare(keys,['down','down','return'])
    })
}
toExport["ttio"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC90dGlvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQWlCUSxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07Z0JBRWpDLEVBQUU7Ozs7UUFJRixRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU07UUFFakMsT0FBTyxFQUFFLFVBQVUsT0FBTyxLQUFLO2dCQUUvQixLQUFLLE9BQVM7Z0JBQ2QsS0FBSyxHQUFHLElBQU07Z0JBQ2QsS0FBSyxHQUFHLElBQU07Ozs7UUFJZCxPQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUs7Z0JBRS9CLEtBQUssT0FBUztnQkFDZCxLQUFLLEdBQUcsSUFBTTtnQkFDZCxLQUFLLEdBQUcsSUFBTTs7OztRQUlkO1FBRUEsRUFBRSxHQUFHOzttQkFBaUIsS0FBSyxLQUFLOztRQUVoQyxFQUFFLE9BQU8sT0FBTyxLQUFLO2dCQUVyQixNQUFRLE9BQU8sT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/ttio.kode
