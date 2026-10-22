var toExport = {}
var lines, posl, result, rngs, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool edit"] = async function ()
{
    await section("toggleCommentTypesInLineRangesAtIndices", async function ()
    {
        lines = belt.seglsForText(`code = true
# comment
# a
code = 'yes' # trailing`)
        result = belt.seglsForText(`code = true
###
comment
a
###
code = 'yes' # trailing`)
    })
    await section("deleteLineRangesAndAdjustPositions", async function ()
    {
        lines = belt.seglsForText(`1234567890
abcdefghij`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,0]],[[5,1]]),[lines,[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,6,0]],[[5,1]]),[[kseg('123457890'),kseg('abcdefghij')],[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,1]],[[5,1]]),[[kseg('12345fghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,1,1,1]],[[0,1]]),[[kseg('1234567890'),kseg('bcdefghij')],[[0,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,3,1]],[[3,1]]),[[kseg('12345defghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[3,0,5,1]],[[3,1]]),[[kseg('123fghij')],[[3,0]]])
        lines = belt.seglsForText(`line 1
line 2
line 3`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,0,6,1]],[[6,0],[6,1]]),[[kseg('line 3')],[[0,0]]])
    })
    await section("insertTextAtPositions", async function ()
    {
        await section("single spans", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'',[[0,0]]),[kseg.segls('line 1\nline 2'),[[0,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0]]),[kseg.segls('a line 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0],[0,1]]),[kseg.segls('a line 1\na line 2'),[[2,0],[2,1]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0]]),[kseg.segls('xlixne 1\nline 2'),[[1,0],[4,0]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0],[6,0]]),[kseg.segls('xlixne 1x\nline 2'),[[1,0],[4,0],[9,0]]])
            compare(belt.insertTextAtPositions(lines,'z',[[0,0],[2,0],[6,0],[1,1],[2,1],[4,1]]),[kseg.segls('zlizne 1z\nlziznez 2'),[[1,0],[4,0],[9,0],[2,1],[4,1],[7,1]]])
            compare(belt.insertTextAtPositions(lines,'ｔ',[[0,0]]),[kseg.segls('ｔline 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(kseg.segls('ｔline 1\nline 2'),'ｔ',[[2,0]]),[kseg.segls('ｔｔline 1\nline 2'),[[4,0]]])
        })
        await section("multiple lines into single cursor", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,0]]),[kseg.segls('a\nb\nline 1\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[2,0]]),[kseg.segls('lia\nbne 1\nline 2'),[[1,1]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,1]]),[kseg.segls('line 1\na\nb\nline 2'),[[0,3]]])
            compare(belt.insertTextAtPositions(lines,'a\n',[[0,1]]),[kseg.segls('line 1\na\nline 2'),[[0,2]]])
        })
        await section("multiple lines into multi cursor", async function ()
        {
            lines = belt.seglsForText(`1234
5678`)
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[0,1]]),[kseg.segls('X1234\nY5678'),[[1,0],[1,1]]])
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('X1Y2X3Y4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
            compare(belt.insertTextAtPositions(lines,'@\n$\n%',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('@1$2%3@4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
        })
        await section("newlines", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'\n',[[2,0]]),[kseg.segls('li\nne 1\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,0]]),[kseg.segls('line 1\n\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,1]]),[kseg.segls('line 1\n\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[2,1]]),[kseg.segls('line 1\nli\nne 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,1]]),[kseg.segls('line 1\nline 2\n'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,0],[0,1]]),[kseg.segls('\nline 1\n\nline 2'),[[0,1],[0,3]]])
            lines = belt.seglsForText(`◆1
◆2
◆3
◆4`)
            compare(belt.insertTextAtPositions(lines,'\n',[[1,0],[1,1],[1,2],[1,3]]),[kseg.segls('◆\n1\n◆\n2\n◆\n3\n◆\n4'),[[0,1],[0,3],[0,5],[0,7]]])
        })
        await section("into indented lines", async function ()
        {
            lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
            await section("single span", async function ()
            {
                compare(belt.insertTextAtPositions(lines,'~!',[[4,1]]),[kseg.segls('◆1\n    ~!◆2\n        ◆3'),[[6,1]]])
                compare(belt.insertTextAtPositions(lines,'#{',[[2,2]]),[kseg.segls('◆1\n    ◆2\n  #{      ◆3'),[[4,2]]])
            })
            await section("newline into single cursor", async function ()
            {
                compare(belt.insertTextAtPositions(lines,'\n',[[4,1]]),[kseg.segls('◆1\n    \n    ◆2\n        ◆3'),[[4,2]]])
            })
            await section("multiple lines into single cursor", async function ()
            {
                compare(belt.insertTextAtPositions(lines,'a\nb',[[4,1]]),[kseg.segls('◆1\n    a\n    b\n    ◆2\n        ◆3'),[[4,3]]])
            })
        })
    })
    await section("insertSurroundAtRanges", async function ()
    {
        lines = belt.seglsForText(`line1
line2`)
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'}',['{','}']),[kseg.segls('l{in}e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],']',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'{',['{','}']),[kseg.segls('l{in}e1\nline2'),[[2,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'[',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[2,0],[2,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'"',['"','"']),[kseg.segls('l"in"e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"}",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[6,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"#",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[3,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
    })
    await section("moveLineRangesAndPositionsAtIndicesInDirection", async function ()
    {
        lines = immutable(['a','b','c'])
        rngs = immutable([])
        posl = immutable([])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'down'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'up'),[['b','a','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'up'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'up'),[['b','c','a'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'up'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'down'),[['a','c','b'],[],[[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'up'),[['b','a','c'],[],[[0,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        lines = immutable(['a','b','c','d','e'])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'up'),[['b','c','d','a','e'],[],[[0,0],[0,1],[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'down'),[['a','e','b','c','d'],[],[[0,2],[0,3],[0,4]]])
    })
    await section("prepareWordsForCompletion", async function ()
    {
        words = belt.linesForText(`Alice
Alice!
Alice!"
Alice)--
Alice,
Alice,)
Alice.
Alice:
Alice;
Alice’s
Alice’s,`)
        compare(belt.prepareWordsForCompletion('A','A',words),['Alice'])
        compare(belt.prepareWordsForCompletion('"','"',['"#fff"']),['"#fff"'])
        compare(belt.prepareWordsForCompletion('f','f',['func()']),['func','func()'])
        compare(belt.prepareWordsForCompletion('fa','fa',['f']),[])
        compare(belt.prepareWordsForCompletion('w','w',['word[@turd.length..]']),['word','word[@turd.length..]'])
        compare(belt.prepareWordsForCompletion('a.b','b',['a.b.c.d']),[])
        compare(belt.prepareWordsForCompletion('a.b.','.',['a.b.c.d']),['.b','.c','.d'])
        compare(belt.prepareWordsForCompletion('a.b.c','c',['a.b.c.d']),[])
        compare(belt.prepareWordsForCompletion('a.b.c.','.',['a.b.c.d']),['.b','.c','.d'])
        compare(belt.prepareWordsForCompletion('word','word',['word[@turd.length..]']),[])
        compare(belt.prepareWordsForCompletion('k','k',['kseg','key']),['key','kseg'])
        compare(belt.prepareWordsForCompletion('he','he',['hello','hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('he','he',['"hello"','@hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('a.','.',['0.1','1.234','obj.prop']),['.prop'])
        compare(belt.prepareWordsForCompletion('0.','.',['0.1','1.234','obj.prop']),['.1'])
        compare(belt.prepareWordsForCompletion('3.1','1',['1.123','1.234','obj.prop']),[])
        compare(belt.prepareWordsForCompletion('rugga','r',['rofl','rug']),['rofl','rug'])
        compare(belt.prepareWordsForCompletion('rugga','ru',['rug']),['rug'])
        compare(belt.prepareWordsForCompletion('mc','mc',['mc[0]','mc[1]']),[])
        compare(belt.prepareWordsForCompletion('@','@',['@color.dot)']),['@color','@color.dot'])
        compare(belt.prepareWordsForCompletion('@','@',["@side='left"]),['@side'])
        compare(belt.prepareWordsForCompletion('@','@',["@side='left'"]),['@side'])
        compare(belt.prepareWordsForCompletion('b','b',['a\n','b\n']),[])
        compare(belt.prepareWordsForCompletion('@img.pop','pop',['@img.pop()']),['pop()'])
    })
    await section("indentLineRangesAndPositionsAtIndices", async function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,0,1,1]])
        rngs = immutable([[0,1],[1,1]])
        compare(belt.indentLineRangesAndPositionsAtIndices(lines,posl,rngs,[0,1]),[[kseg('    ◆1'),kseg('        ◆2'),kseg('        ◆3')],[[4,0,5,1]],[[4,1],[5,1]]])
    })
    await section("deindentLineRangesAndPositionsAtIndices", async function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,1,1,2]])
        rngs = immutable([[0,1],[1,2]])
        compare(belt.deindentLineRangesAndPositionsAtIndices(lines,posl,rngs,[1,2]),[[kseg('◆1'),kseg('◆2'),kseg('    ◆3')],[[0,1,0,2]],[[0,1],[0,2]]])
    })
}
toExport["tool edit"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQVFVLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7Ozs7OztRQVlKLFFBQVEsS0FBSyxhQUFhOzs7O1FBTzFCLFNBQVMsS0FBSyxhQUFhOzs7Ozs7Ozs7UUFtQjNCLFFBQVEsS0FBSyxhQUFhOztnQkFLMUIsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTyxRQUFRLEVBQUU7Z0JBQy9FLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxhQUFhLEtBQUssaUJBQWlCLEVBQUU7Z0JBQ2hILEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxpQkFBaUIsRUFBRTtnQkFDOUYsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDaEgsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLG1CQUFtQixFQUFFO2dCQUNoRyxLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssZUFBZSxFQUFFO1FBRTVGLFFBQVEsS0FBSyxhQUFhOzs7Z0JBTTFCLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFRLEtBQUssYUFBYSxFQUFFOzs7Ozs7WUFZNUYsUUFBUSxLQUFLLGFBQ1Q7O29CQUtKLEtBQUssc0JBQXNCLE1BQU0sS0FBVyxFQUFFLE1BQWEsS0FBSyxNQUFNLG9CQUFvQixFQUFFO29CQUM1RixLQUFLLHNCQUFzQixNQUFNLE9BQVcsRUFBRSxNQUFhLEtBQUssTUFBTSxzQkFBc0IsRUFBRTtvQkFDOUYsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/edit.kode
