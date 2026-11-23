var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var bad, batched, brackets, brk, c, cells, l, line, lines, lines2, matches, newLines, newRanges, one, pairs, pos, posl, ranges, rect, res, rngs, segls, spans, spec, sps, strings, strs, text, wide, zero

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool belt"] = async function ()
{
    await section("cells", async function ()
    {
        l = belt.linesForText(`012
abc
XYZ`)
        cells = belt.cellsForLines(l)
        rect = belt.cellsInRect(cells,0,0,1,1)
        var list = _k_.list(rect)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c.cell.fg = [255,0,0]
        }
        compare(cells[0][0].fg,[255,0,0])
        compare(cells[1][1].fg,[255,0,0])
        compare(cells[2][2].fg,[])
        compare(belt.clampCellRect(cells,0,0,1,1),[0,0,1,1])
        compare(belt.clampCellRect(cells,-1,-1,1,1),[0,0,1,1])
        compare(belt.cellsInRect(cells,0,0,1,1).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
        compare(belt.cellsInRect(cells,1,1,1,1).map(function (n)
        {
            return n.cell.char
        }),['b'])
        compare(belt.cellsInRect(cells,0,0,2,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','2'])
        compare(belt.cellsInRect(cells,1,2,2,2).map(function (n)
        {
            return n.cell.char
        }),['Y','Z'])
        compare(belt.cellNeighborsAtPos(cells,0,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
    })
    await section("extendLineRangesToPosition", async function ()
    {
        lines = ['123','45','6']
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([]),[0,0],[0,2]),[[0,0,0,2]])
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([[0,0,1,0],[2,0,3,0]]),[1,1],[0,2]),[[0,0,1,0],[2,0,3,0],[1,1,0,2]])
    })
    await section("ascii header at a position without a word changes nothing", async function ()
    {
        lines = ['x = y']
        var _b_ = belt.insertAsciiHeaderForPositionsAndRanges(lines,[[2,0]],[]); lines2 = _b_[0]; posl = _b_[1]; ranges = _b_[2]

        compare(lines2,['x = y'])
        compare(posl,[[2,0]])
        compare(ranges,[])
    })
    await section("removeFromLineRangesBetweenPositions", async function ()
    {
        compare(belt.removeFromLineRangesBetweenPositions([[2,0,4,0]],[4,0],[3,0]),[[2,0,3,0]])
        compare(belt.removeFromLineRangesBetweenPositions([[3,0,5,0]],[3,0],[4,0]),[[4,0,5,0]])
        compare(belt.removeFromLineRangesBetweenPositions([[0,0,0,2]],[0,2],[0,1]),[[0,0,0,1]])
        compare(belt.removeFromLineRangesBetweenPositions([[3,0,4,0]],[4,0],[3,0]),[])
        compare(belt.removeFromLineRangesBetweenPositions([[2,0,3,0],[5,0,6,0]],[4,0],[3,0]),[[2,0,3,0],[5,0,6,0]])
    })
    await section("jumpDelta", async function ()
    {
        line = '1  '
        compare(belt.jumpDelta(line,0,1,['empty']),1)
        compare(belt.jumpDelta(line,1,1,['empty']),1)
        compare(belt.jumpDelta(line,2,1,['empty']),1)
        compare(belt.jumpDelta(line,3,1,['empty']),1)
        compare(belt.jumpDelta(line,4,1,['empty']),1)
        line = '    a = b ->  '
        compare(belt.jumpDelta(line,0,1,['ws']),4)
        compare(belt.jumpDelta(line,1,1,['ws']),3)
        compare(belt.jumpDelta(line,2,1,['ws']),2)
        compare(belt.jumpDelta(line,3,1,['ws']),1)
        compare(belt.jumpDelta(line,4,1,['ws']),1)
        compare(belt.jumpDelta(line,5,1,['ws']),1)
        compare(belt.jumpDelta(line,6,1,['ws']),1)
        compare(belt.jumpDelta(line,7,1,['ws']),1)
        compare(belt.jumpDelta(line,8,1,['ws']),1)
        compare(belt.jumpDelta(line,9,1,['ws']),1)
        compare(belt.jumpDelta(line,10,1,['ws']),1)
        compare(belt.jumpDelta(line,11,1,['ws']),1)
        compare(belt.jumpDelta(line,12,1,['ws']),2)
        line = '  ab += cd ;;  '
        compare(belt.jumpDelta(line,0,1,['word']),1)
        compare(belt.jumpDelta(line,1,1,['word']),1)
        compare(belt.jumpDelta(line,2,1,['word']),2)
        compare(belt.jumpDelta(line,3,1,['word']),1)
        compare(belt.jumpDelta(line,4,1,['word']),1)
        compare(belt.jumpDelta(line,5,1,['word']),1)
        compare(belt.jumpDelta(line,6,1,['word']),1)
        compare(belt.jumpDelta(line,7,1,['word']),1)
        compare(belt.jumpDelta(line,8,1,['word']),2)
        compare(belt.jumpDelta(line,9,1,['word']),1)
        compare(belt.jumpDelta(line,10,1,['word']),1)
        compare(belt.jumpDelta(line,11,1,['word']),1)
        compare(belt.jumpDelta(line,0,1,['punct']),1)
        compare(belt.jumpDelta(line,1,1,['punct']),1)
        compare(belt.jumpDelta(line,2,1,['punct']),1)
        compare(belt.jumpDelta(line,3,1,['punct']),1)
        compare(belt.jumpDelta(line,4,1,['punct']),1)
        compare(belt.jumpDelta(line,5,1,['punct']),2)
        compare(belt.jumpDelta(line,6,1,['punct']),1)
        compare(belt.jumpDelta(line,7,1,['punct']),1)
        compare(belt.jumpDelta(line,8,1,['punct']),1)
        compare(belt.jumpDelta(line,9,1,['punct']),1)
        compare(belt.jumpDelta(line,10,1,['punct']),1)
        compare(belt.jumpDelta(line,11,1,['punct']),2)
        compare(belt.jumpDelta(line,0,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,1,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,2,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,3,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,4,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,5,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,6,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,7,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,8,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,9,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,10,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,11,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,0,-1,['ws','word','punct']),0)
        compare(belt.jumpDelta(line,1,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,3,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,5,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,6,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,7,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,8,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,9,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,10,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,11,-1,['ws','word','punct']),-1)
        line = '  '
        compare(belt.jumpDelta(line,5,-1,['empty']),-3)
        compare(belt.jumpDelta(line,4,-1,['empty']),-2)
        compare(belt.jumpDelta(line,3,-1,['empty']),-1)
        compare(belt.jumpDelta(line,5,-1,['ws']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws']),-1)
        compare(belt.jumpDelta(line,3,-1,['ws']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws']),-2)
    })
    await section("isPosInsideRange", async function ()
    {
        compare(belt.isPosInsideRange([0,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([1,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([0,1],[0,0,1,0]),false)
        compare(belt.isPosInsideRange([7,1],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([5,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([10,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([4,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([11,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,3],[5,2,10,2]),false)
    })
    await section("rangeContainsRange", async function ()
    {
        compare(belt.rangeContainsRange([0,0,1,0],[0,0,0,0]),true)
        compare(belt.rangeContainsRange([0,0,1,0],[1,0,1,0]),true)
    })
    await section("normalizeRanges", async function ()
    {
        compare(belt.normalizeRanges([]),[])
        compare(belt.normalizeRanges([[0,1,3,4]]),[[0,1,3,4]])
        compare(belt.normalizeRanges([[0,4,3,1]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,1,0,4]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,4,2,4]]),[[2,4,3,4]])
        compare(belt.normalizeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9],[1,1,2,2]])
        compare(belt.normalizeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9],[1,1,2,2]])
    })
    await section("mergeLineRanges", async function ()
    {
        lines = ['1234567890','1234567890','1234567890']
        compare(belt.mergeLineRanges(lines,[[0,0,9,9],[1,1,2,2]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9],[0,0,10,0],[0,8,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[8,0,10,0]]),[[4,0,6,0],[8,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[7,0,10,0]]),[[4,0,6,0],[7,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[6,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[5,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,1,10,1],[0,2,4,2]]),[[4,1,4,2]])
    })
    await section("rangeOfClosestWordToPos", async function ()
    {
        lines = ['1 2  3   4','   ab ghij']
        compare(belt.rangeOfClosestWordToPos(lines,[0,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[2,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[3,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[4,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[5,0]),[5,0,6,0])
        compare(belt.rangeOfClosestWordToPos(lines,[0,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[5,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[6,1]),[6,1,10,1])
    })
    await section("rangeOfWordOrWhitespaceLeftToPos", async function ()
    {
        lines = ['1 2  3   4','   ab  ghij']
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[3,1]),[0,1,3,1])
        segls = kseg.segls(lines.join('\n'))
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,1]),[0,1,3,1])
        segls = kseg.segls('  🧑🌾  ab🌾cde')
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[2,0]),[0,0,2,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[4,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[5,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[6,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[7,0]),[4,0,5,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[8,0]),[4,0,6,0])
    })
    await section("chunkBeforePos", async function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkBeforePos(segls,[0,0]),'')
        compare(belt.chunkBeforePos(segls,[1,0]),'')
        compare(belt.chunkBeforePos(segls,[0,1]),'')
        compare(belt.chunkBeforePos(segls,[1,1]),'1')
        compare(belt.chunkBeforePos(segls,[3,1]),'1.4')
        compare(belt.chunkBeforePos(segls,[5,1]),'')
        compare(belt.chunkBeforePos(segls,[9,1]),'x:z')
    })
    await section("chunkAfterPos", async function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkAfterPos(segls,[0,0]),'')
        compare(belt.chunkAfterPos(segls,[1,0]),'')
        compare(belt.chunkAfterPos(segls,[0,1]),'1.4')
        compare(belt.chunkAfterPos(segls,[1,1]),'.4')
        compare(belt.chunkAfterPos(segls,[3,1]),'')
        compare(belt.chunkAfterPos(segls,[5,1]),'')
        compare(belt.chunkAfterPos(segls,[6,1]),'x:z')
        compare(belt.chunkAfterPos(segls,[7,1]),':z')
    })
    await section("isFullLineRange", async function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isFullLineRange(lines,[0,0,0,1]),true)
        compare(belt.isFullLineRange(lines,[0,0,0,0]),true)
        compare(belt.isFullLineRange(lines,[0,1,3,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,5,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,2,1]),false)
        compare(belt.isFullLineRange(lines,[1,1,3,1]),false)
    })
    await section("line index map", async function ()
    {
        compare(belt.lineIndexMap(['a','b','c'],['a','b','c']),[0,1,2])
        compare(belt.lineIndexMap(['a','b','c'],['x','a','b','c']),[1,2,3])
        compare(belt.lineIndexMap(['a','b','c'],['a','x','b','c']),[0,2,3])
        compare(belt.lineIndexMap(['a','b','c'],['a','x','y','b','c']),[0,3,4])
        compare(belt.lineIndexMap(['a','b','c'],['b','c']),[0,0,1])
        compare(belt.lineIndexMap(['a','b','c','d'],['a','c','d']),[0,1,1,2])
        compare(belt.lineIndexMap(['a','b','c'],['a']),[0,0,0])
        compare(belt.lineIndexMap(['a','b','c'],['a','B','c']),[0,1,2])
        compare(belt.lineIndexMap(['a','b'],['x','y','z']),[0,1])
        compare(belt.lineIndexMap(['c','a','c','d','a','c'],['a','d','d']),[0,0,1,2,2,2])
        compare(belt.lineIndexMap([],['a']),[])
    })
    await section("lineIndicesForRangesAndPositions", async function ()
    {
        compare(belt.lineIndicesForRangesAndPositions([],[[1,1],[1,2],[1,3]]),[1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,0,2,0]],[[1,1],[1,2],[1,3]]),[0,1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,1,2,2]],[[1,6],[1,5],[1,4]]),[1,2,4,5,6])
    })
    await section("linesIndicesForSpans", async function ()
    {
        compare(belt.lineIndicesForSpans([]),[])
        compare(belt.lineIndicesForSpans([[0,1,0]]),[1])
        compare(belt.lineIndicesForSpans([[0,1,0],[1,1,1]]),[1])
    })
    await section("blockRangesForRangesAndPositions", async function ()
    {
        lines = kseg.segls(`line 1
line 2`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[0,0],[0,1]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,0,5,1]],[[0,0]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,1,5,1]],[[0,0]]),[[0,0,6,1]])
        lines = kseg.segls(`line 1
line 2
line 3
line 4
line 5
line 6`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[1,1],[1,2],[1,3]]),[[0,1,6,3]])
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[6,5],[4,3],[2,1]]),[[0,1,6,1],[0,3,6,3],[0,5,6,5]])
    })
    await section("isSpanLineRange", async function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isSpanLineRange(lines,[0,1,1,1]),true)
        compare(belt.isSpanLineRange(lines,[0,0,0,0]),false)
        compare(belt.isSpanLineRange(lines,[0,1,3,1]),false)
        compare(belt.isSpanLineRange(lines,[1,1,1,2]),false)
    })
    await section("isPosAfterSpan", async function ()
    {
        compare(belt.isPosAfterSpan([0,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([4,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([5,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([6,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([0,1],[1,0,5]),true)
    })
    await section("isPosBeforeSpan", async function ()
    {
        compare(belt.isPosBeforeSpan([0,0],[1,0,3]),true)
        compare(belt.isPosBeforeSpan([1,0],[1,0,3]),false)
        compare(belt.isPosBeforeSpan([3,1],[1,0,3]),false)
    })
    await section("isPosInsideSpan", async function ()
    {
        compare(belt.isPosInsideSpan([0,0],[1,0,3]),false)
        compare(belt.isPosInsideSpan([1,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([2,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([3,0],[1,0,3]),false)
    })
    await section("nextSpanAfterPos", async function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.nextSpanAfterPos(spans,[4,0]),[6,0,8])
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,0,3])
        spans = [[0,21,11],[2,22,11],[5,23,11],[7,24,11]]
        compare(belt.nextSpanAfterPos(spans,[11,21]),[2,22,11])
        compare(belt.nextSpanAfterPos(spans,[11,22]),[5,23,11])
        compare(belt.nextSpanAfterPos(spans,[11,23]),[7,24,11])
        compare(belt.nextSpanAfterPos(spans,[11,24]),[0,21,11])
        spans = [[2,1,5],[2,2,5],[2,3,5]]
        compare(belt.nextSpanAfterPos(spans,[5,2]),[2,3,5])
        compare(belt.nextSpanAfterPos(spans,[5,3]),[2,1,5])
        compare(belt.nextSpanAfterPos(spans,[5,1]),[2,2,5])
        spans = [[1,4,3],[3,4,5]]
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,4,3])
        compare(belt.nextSpanAfterPos(spans,[3,4]),[3,4,5])
        compare(belt.nextSpanAfterPos(spans,[5,4]),[1,4,3])
    })
    await section("prevSpanBeforePos", async function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.prevSpanBeforePos(spans,[0,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[1,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[2,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[3,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[4,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[6,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[7,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[9,0]),[6,0,8])
        compare(belt.prevSpanBeforePos(spans,[0,1]),[6,0,8])
    })
    await section("normalizePositions", async function ()
    {
        compare(belt.normalizePositions([[0,0],[1,0],[2,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[0,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[1,0]]),[[1,0],[2,0]])
        compare(belt.normalizePositions([[2,2],[3,3],[1,1]]),[[1,1],[2,2],[3,3]])
        compare(belt.normalizePositions([[2,2],[0,3],[11,1]]),[[11,1],[2,2],[0,3]])
    })
    await section("lineRangeAtPos", async function ()
    {
        lines = belt.seglsForText(`🌾🧑`)
        compare(belt.lineRangeAtPos(lines,[0,0]),[0,0,4,0])
    })
    await section("seglRangeAtPos", async function ()
    {
        lines = belt.seglsForText(`🧑🌾`)
        compare(belt.seglRangeAtPos(lines,[0,0]),[0,0,2,0])
    })
    await section("lineRangesInRange", async function ()
    {
        lines = belt.seglsForText(`1

12
abc`)
        compare(belt.lineRangesInRange(lines,[0,0,0,2]),[[0,0,1,0],[0,1,0,1],[0,2,2,2]])
    })
    await section("splitLineRanges", async function ()
    {
        lines = belt.linesForText(`1

12
abc`)
        compare(belt.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
        compare(belt.splitLineRanges(lines,[[0,2,1,2],[2,2,3,2]]),[[0,2,1,2],[2,2,3,2]])
    })
    await section("seglsForText", async function ()
    {
        segls = belt.seglsForText(`123
456

abc
def`)
        compare(segls,[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
    })
    await section("seglsForRange", async function ()
    {
        compare(belt.seglsForRange(segls,[0,0,3,4]),[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
        compare(belt.seglsForRange(segls,[0,0,0,0]),[[]])
        compare(belt.seglsForRange(segls,[0,0,1,0]),[['1']])
        compare(belt.seglsForRange(segls,[3,0,0,1]),[[],[]])
        compare(belt.seglsForRange(segls,[3,0,1,1]),[[],['4']])
    })
    await section("replaceTextsInLineRanges", async function ()
    {
        lines = belt.seglsForText(`b1
b2
--
a1
a2`)
        var _c_ = belt.replaceTextsInLineRanges(lines,[[0,0,2,1],[0,3,2,4]],['a1\na2','b1\nb2']); newLines = _c_[0]; newRanges = _c_[1]

        compare(newLines.map(function (l)
        {
            return kseg.str(l)
        }),['a1','a2','--','b1','b2'])
        compare(newRanges,[[0,0,2,1],[0,3,2,4]])
        lines = belt.linesForText('dcab')
        var _d_ = belt.replaceTextsInLineRanges(lines,[[0,0,2,0],[2,0,4,0]],['ab','dc']); newLines = _d_[0]; newRanges = _d_[1]

        compare(newLines.map(function (l)
        {
            return kseg.str(l)
        }),['abdc'])
        compare(newRanges,[[0,0,2,0],[2,0,4,0]])
        lines = belt.seglsForText(`banana
--
apple`)
        var _e_ = belt.replaceTextsInLineRanges(lines,[[0,0,6,0],[0,2,5,2]],['apple','banana']); newLines = _e_[0]; newRanges = _e_[1]

        compare(newLines.map(function (l)
        {
            return kseg.str(l)
        }),['apple','--','banana'])
        compare(newRanges,[[0,0,5,0],[0,2,6,2]])
    })
    await section("rangesForLinesSplitAtPositions", async function ()
    {
        lines = belt.linesForText(`123
456

abc
def`)
        compare(belt.rangesForLinesSplitAtPositions(lines,[]),[])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0]]),[[0,0,0,0],[0,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[1,0]]),[[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,2]]),[[0,0,0,2],[0,2,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0],[1,0]]),[[0,0,0,0],[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[3,0],[3,1]]),[[0,0,3,0],[3,0,3,1],[3,1,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,5]]),[[0,0,3,4],[3,4,3,4]])
    })
    await section("rangesOfStringsInText", async function ()
    {
        compare(belt.rangesOfStringsInText("hello"),[])
        compare(belt.rangesOfStringsInText("he'll'o"),[[2,0,6,0]])
    })
    await section("widthOfLines", async function ()
    {
        text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        lines = belt.linesForText(text)
        compare(belt.widthOfLines(lines),50)
    })
    await section("isRangeInString", async function ()
    {
        lines = belt.linesForText(`123
'456'

'abc'
def`)
        compare(belt.isRangeInString(lines,[0,0,0,0]),false)
        compare(belt.isRangeInString(lines,[0,2,0,2]),false)
        compare(belt.isRangeInString(lines,[0,3,0,3]),false)
        compare(belt.isRangeInString(lines,[1,3,5,3]),false)
        compare(belt.isRangeInString(lines,[1,1,1,1]),true)
        compare(belt.isRangeInString(lines,[1,3,2,3]),true)
        compare(belt.isRangeInString(lines,[1,3,3,3]),true)
        compare(belt.isRangeInString(lines,[1,3,4,3]),true)
    })
    await section("rangesOfPairsSurroundingPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        pairs = [["'","'"],['"','"'],['#{','}'],['[',']'],['(',')']]
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfPairsSurroundingPositions(lines,pairs,posl),[[3,2,5,2],[2,3,5,3],[3,4,5,4]])
    })
    await section("rangesOfNestedPairsAtPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfNestedPairsAtPositions(lines,posl),[[0,2,6,2],[0,3,6,3],[0,4,7,4],[1,4,6,4],[2,4,5,4],[3,4,4,4]])
    })
    await section("spansOfNestedPairsAtPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.spansOfNestedPairsAtPositions(lines,posl),[[[0,2,1],[6,2,7],[0,3,1],[6,3,7],[0,4,1],[7,4,8],[1,4,2],[6,4,7],[2,4,3],[5,4,6],[3,4,4],[4,4,5]],[[0,4,1],[7,4,8],[1,4,2],[6,4,7],[2,4,3],[5,4,6],[3,4,4],[4,4,5]],[[0,2,1],[6,2,7],[0,3,1],[6,3,7]]])
        lines = belt.linesForText(`[[{()}]]`)
        posl = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]
        one = []
        var list1 = _k_.list(posl)
        for (var _f_ = 0; _f_ < list1.length; _f_++)
        {
            pos = list1[_f_]
            var _10_ = belt.spansOfNestedPairsAtPositions(lines,[pos]); sps = _10_[0]; brk = _10_[1]; strs = _10_[2]

            one = one.concat(sps)
        }
        var _11_ = belt.spansOfNestedPairsAtPositions(lines,posl); batched = _11_[0]; brk = _11_[1]; strs = _11_[2]

        compare(batched,one)
        one = []
        var list2 = _k_.list(posl)
        for (var _12_ = 0; _12_ < list2.length; _12_++)
        {
            pos = list2[_12_]
            rngs = belt.rangesOfNestedPairsAtPositions(lines,[pos])
            one = one.concat(rngs)
        }
        compare(belt.rangesOfNestedPairsAtPositions(lines,posl),one)
        compare(belt.spansOfNestedPairsAtPositions(lines,[[3,0]]),[[[0,0,1],[7,0,8],[1,0,2],[6,0,7],[2,0,3],[5,0,6],[3,0,4],[4,0,5]],[[0,0,1],[7,0,8],[1,0,2],[6,0,7],[2,0,3],[5,0,6],[3,0,4],[4,0,5]],[]])
    })
    await section("openCloseSpansForPositions", async function ()
    {
        segls = kseg.segls(`[[{()}]]
'45""6'
'a{}c'`)
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[3,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[5,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[0,1]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[6,1]]),[])
        compare(belt.stringDelimiterSpansForPositions(segls,[[0,1]]),[[0,1,1],[6,1,7]])
        compare(belt.stringDelimiterSpansForPositions(segls,[[6,1]]),[[0,1,1],[6,1,7]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[2,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[3,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[4,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[2,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[3,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[4,2]])),[[0,2,1],[5,2,6]])
        segls = kseg.segls(`next = lines[ap[1]][ap[0]]  `)
        compare(belt.openCloseSpansForPositions(segls,[[25,0]]),[[19,0,20],[25,0,26]])
        compare(belt.openCloseSpansForPositions(segls,[[26,0]]),[[19,0,20],[25,0,26]])
        segls = kseg.segls(`s[2]`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[1,0,2],[3,0,4]])
        segls = kseg.segls(`x(日本)y`)
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[])
        var _13_ = belt.spansOfNestedPairsAtPositions(segls,[[2,0]]); spans = _13_[0]; brackets = _13_[1]; strings = _13_[2]

        compare(spans,[[1,0,2],[6,0,7]])
        compare(brackets,[[1,0,2],[6,0,7]])
        compare(strings,[])
        compare(belt.rangesOfNestedPairsAtPositions(segls,[[2,0]]),[[1,0,6,0]])
        segls = kseg.segls(`(日本)`)
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[0,0,1],[5,0,6]])
        segls = kseg.segls(`(a)`)
        compare(belt.openCloseSpansForPositions(segls,[[20,0]]),[[0,0,1],[2,0,3]])
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[[0,0,1],[2,0,3]])
        segls = kseg.segls(`f(a,
  b,
  c)`)
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[2,2]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[40,0]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[40,2]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[2,3]]),[])
        segls = kseg.segls(`foo(bar
baz
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[4,2]]),[])
        segls = kseg.segls(`foo)bar
baz
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[])
        segls = kseg.segls(`foo
baz)
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[3,1]]),[])
        segls = kseg.segls(`([)] x`)
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[3,0]]),[])
        segls = kseg.segls(`((((((((((x))))))))))`)
        compare(belt.openCloseSpansForPositions(segls,[[10,0]]),[[9,0,10],[11,0,12]])
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[20,0,21]])
        compare(belt.openCloseSpansForPositions(segls,[[20,0]]),[[0,0,1],[20,0,21]])
        segls = kseg.segls(`(日本)a(日本)`)
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[7,0,8],[12,0,13]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[[7,0,8],[12,0,13]])
        segls = kseg.segls(`[a](b) c`)
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[3,0,4],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[])
    })
    await section("bracketIndex", async function ()
    {
        compare(belt.bracketIndex(kseg.segls('abc')),[])
        compare(belt.bracketIndex(kseg.segls('')),[])
        compare(belt.bracketIndex(kseg.segls('()[]{}')),[[0,0,'('],[0,1,')'],[0,2,'['],[0,3,']'],[0,4,'{'],[0,5,'}']])
        segls = kseg.segls(`ab(
日本]`)
        compare(belt.bracketIndex(segls),[[0,2,'('],[1,2,']']])
        compare(belt.bracketIndex(kseg.segls("'a(b'")),[[0,2,'(']])
    })
    await section("positionColumns", async function ()
    {
        compare(belt.positionColumns([[0,0],[0,1]]),[[[0,0],[0,1]]])
        compare(belt.positionColumns([[0,0],[0,1],[1,1]]),[[[0,0],[0,1]],[[1,1]]])
    })
    await section("indexOfExtremePositionInDirection", async function ()
    {
        posl = [[12,3],[4,4],[3,6],[10,6],[5,7],[13,8],[2,11]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'down'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'right'),5)
        compare(belt.indexOfExtremePositionInDirection(posl,'up'),0)
        posl = [[3,3],[3,4],[3,5]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',2),2)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',2),2)
    })
    await section("ex command parsing", async function ()
    {
        compare(belt.parseEx('s/foo/bar/'),{name:'s',bang:false,args:'/foo/bar/',range:null})
        compare(belt.parseEx('wq!'),{name:'wq',bang:true,args:'',range:null})
        compare(belt.parseEx('q!'),{name:'q',bang:true,args:'',range:null})
        compare(belt.parseEx('w out.txt'),{name:'w',bang:false,args:'out.txt',range:null})
        compare(belt.parseEx('%s/foo/bar/g'),{name:'s',bang:false,args:'/foo/bar/g',range:{kind:'all'}})
        compare(belt.parseEx("'<,'>s/a/b/"),{name:'s',bang:false,args:'/a/b/',range:{kind:'visual'}})
        compare(belt.parseEx('5,9s/a/b/g'),{name:'s',bang:false,args:'/a/b/g',range:{from:5,to:9}})
        compare(belt.parseEx('5s/a/b/'),{name:'s',bang:false,args:'/a/b/',range:{from:5,to:5}})
        compare(belt.parseEx('.,$s/a/b/'),{name:'s',bang:false,args:'/a/b/',range:{from:'current',to:'last'}})
        compare(belt.parseEx('normal I# '),{name:'normal',bang:false,args:'I# ',range:null})
        compare(belt.parseEx('normal  x'),{name:'normal',bang:false,args:' x',range:null})
        compare(belt.parseEx('g/pat/d'),{name:'g',bang:false,args:'/pat/d',range:null})
        compare(belt.parseEx('g!/pat/d'),{name:'g',bang:true,args:'/pat/d',range:null})
        compare(belt.parseEx('%g/pat/normal I# '),{name:'g',bang:false,args:'/pat/normal I# ',range:{kind:'all'}})
        compare(belt.parseEx('g /pat/d'),{name:'g',bang:false,args:'/pat/d',range:null})
    })
    await section("global parsing", async function ()
    {
        compare(belt.parseGlobal('/pat/d'),{pattern:'pat',command:'d'})
        compare(belt.parseGlobal(' /pat/normal I# '),{pattern:'pat',command:'normal I# '})
        compare(belt.parseGlobal('/a\\/b/d'),{pattern:'a/b',command:'d'})
        compare(belt.parseGlobal('/pat/').error,'command required')
        compare(belt.parseGlobal('/pat').error,'command required')
        compare(belt.parseGlobal('').error,'argument required')
    })
    await section("substitute parsing", async function ()
    {
        compare(belt.parseSubstitute('/foo/bar/g'),{pattern:'foo',tokens:[{kind:'literal',text:'bar'}],flags:{g:true,i:false,c:false},hasReplacement:true})
        compare(belt.parseSubstitute('#a/b#c#'),{pattern:'a/b',tokens:[{kind:'literal',text:'c'}],flags:{g:false,i:false,c:false},hasReplacement:true})
        compare(belt.parseSubstitute('/a\\/b/c/').pattern,'a/b')
        compare(belt.parseSubstitute('/a\\/b/c/').tokens,[{kind:'literal',text:'c'}])
        compare(belt.parseSubstitute('/a/&x/').tokens,[{kind:'whole'},{kind:'literal',text:'x'}])
        compare(belt.parseSubstitute('/(a)(b)/\\2\\1/').tokens,[{kind:'group',index:2},{kind:'group',index:1}])
        compare(belt.parseSubstitute('/a/b/ig').flags,{g:true,i:true,c:false})
        compare(belt.parseSubstitute('/a/b/igi').flags,{g:true,i:true,c:false})
        compare(belt.parseSubstitute('/a/b/c').flags,{g:false,i:false,c:true})
        compare(belt.parseSubstitute('/a/b/gci').flags,{g:true,i:true,c:true})
        compare(belt.parseSubstitutePattern('/foo'),{pattern:'foo',open:true})
        compare(belt.parseSubstitutePattern('/'),{pattern:'',open:true})
        compare(belt.parseSubstitutePattern('/foo/bar'),{pattern:'foo',open:false})
        compare(belt.parseSubstitutePattern('/a\\/b'),{pattern:'a/b',open:true})
        compare(belt.parseSubstitutePattern('foo'),undefined)
        compare(belt.parseSubstitutePattern(''),undefined)
        compare(belt.parseSubstitute('/a/b').pattern,'a')
        compare(belt.parseSubstitute('/a/b').tokens,[{kind:'literal',text:'b'}])
        compare(belt.parseSubstitute('/a').tokens,[])
        compare(belt.parseSubstitute('/a/b').hasReplacement,true)
        compare(belt.parseSubstitute('/a/b/').hasReplacement,true)
        compare(belt.parseSubstitute('/a//').hasReplacement,true)
        compare(belt.parseSubstitute('/a//g').hasReplacement,true)
        compare(belt.parseSubstitute('/a').hasReplacement,false)
        compare(belt.parseSubstitute('/a/').hasReplacement,false)
        compare(belt.parseSubstitute('/a/g').hasReplacement,false)
        compare(belt.parseSubstitute('/a/gi').hasReplacement,false)
        compare(belt.parseSubstitute('/a/gi').flags,{g:true,i:true,c:false})
        compare(belt.parseSubstitute('/a/i').flags,{g:false,i:true,c:false})
        compare(belt.parseSubstitute('/a/g').flags,{g:true,i:false,c:false})
        compare(belt.parseSubstitute('').error,'argument required')
        compare(belt.parseSubstitute('foo').error,'invalid delimiter')
        compare(belt.parseSubstitute('//x/').error,'no previous pattern')
        compare(belt.parseSubstitute('/a/b/x').error,'unknown flag: x')
        compare(belt.parseSubstitute('/a/\\n/').error,'multi-line replacement not supported')
        bad = belt.parseSubstitute('/[/x/')
        compare(bad.error.startsWith('invalid pattern'),true)
    })
    await section("substitute lines", async function ()
    {
        spec = belt.parseSubstitute('/one/1/g')
        res = belt.substituteLine('one two one',spec)
        compare(res.line,'1 two 1')
        compare(res.matches.length,2)
        compare(res.matches[0].x1,0)
        compare(res.matches[0].x2,3)
        compare(res.matches[1].x1,8)
        compare(res.matches[1].x2,11)
        compare(belt.substituteLine('one two one',belt.parseSubstitute('/one/1/')).line,'1 two one')
        compare(belt.substituteLine('ab',belt.parseSubstitute('/(a)(b)/\\2\\1/')).line,'ba')
        compare(belt.substituteLine('foo',belt.parseSubstitute('/o/[&]/')).line,'f[o]o')
        compare(belt.substituteLine('one ONE',belt.parseSubstitute('/ONE/x/i')).line,'x ONE')
        compare(belt.substituteLine('foo',belt.parseSubstitute('/o//g')).line,'f')
        compare(belt.substituteLine('nope',belt.parseSubstitute('/x/y/')).matches,[])
        wide = belt.substituteLine('a日b',belt.parseSubstitute('/日/x/'))
        compare(wide.line,'axb')
        compare(wide.matches[0].x1,1)
        compare(wide.matches[0].x2,3)
        zero = belt.substituteLine('ab',belt.parseSubstitute('/^/x/g'))
        compare(zero.line,'xab')
        compare(zero.matches.length,1)
        compare(zero.matches[0].x1,0)
        compare(zero.matches[0].x2,0)
    })
    await section("line matches", async function ()
    {
        spec = belt.parseSubstitute('/one/1/g')
        compare(belt.lineMatches('one two one',spec).length,2)
        compare(belt.lineMatches('one two one',spec,5).length,1)
        compare(belt.lineMatches('one two one',spec,5)[0].x1,8)
        compare(belt.lineMatches('one two one',spec,9).length,0)
    })
    await section("pattern spans", async function ()
    {
        lines = kseg.segls("one two one\nthree one")
        compare(belt.patternSpans(lines,'one'),[[0,0,3],[8,0,11],[6,1,9]])
        compare(belt.patternSpans(lines,'one',true),[[0,0,3],[8,0,11],[6,1,9]])
        compare(belt.patternSpans(lines,'ONE'),[])
        compare(belt.patternSpans(lines,'ONE',true),[[0,0,3],[8,0,11],[6,1,9]])
        compare(belt.patternSpans(lines,'['),[])
    })
    await section("joining substitutions", async function ()
    {
        line = 'one two one'
        spec = belt.parseSubstitute('/one/1/g')
        matches = belt.substituteLine(line,spec).matches
        compare(belt.joinSubstitution(line,matches,spec.tokens),'1 two 1')
    })
}
toExport["tool belt"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9iZWx0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFTO0lBQUs7O09BQ0wsV0FBUDs7Ozs7O1FBTUosSUFBSSxLQUFLLGFBQWE7OztRQU10QixRQUFRLEtBQUssY0FBYztRQUUzQixPQUFPLEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFOzRCQUMzQjs7O1lBQUw7WUFDQSxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUU7O1FBRVIsUUFBZixNQUFNLEdBQUcsR0FBRyxJQUFNLElBQUksRUFBRTtRQUNULFFBQWYsTUFBTSxHQUFHLEdBQUcsSUFBTSxJQUFJLEVBQUU7UUFDVCxRQUFmLE1BQU0sR0FBRyxHQUFHO1FBRXFCLFFBQWpDLEtBQUssY0FBYyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUU7UUFDUCxRQUFuQyxLQUFLLGNBQWMsTUFBTSxHQUFHLEdBQUcsRUFBRSxJQUFLLEVBQUUsRUFBRSxFQUFFO1FBRVksUUFBeEQsS0FBSyxZQUFZLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxjQUFLOzttQkFBTSxFQUFFLEtBQUs7WUFBUyxJQUFJLElBQUksSUFBSTtRQUNmLFFBQXhELEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsY0FBSzs7bUJBQU0sRUFBRSxLQUFLO1lBQVM7UUFDSCxRQUF4RCxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSTtRQUNYLFFBQXhELEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsY0FBSzs7bUJBQU0sRUFBRSxLQUFLO1lBQVMsSUFBSTtRQUVKLFFBQTNELEtBQUssbUJBQW1CLE1BQU0sRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSSxJQUFJOzs7O1FBSTFFLFNB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QUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWhELEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtRQUVGLFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBYTtRQUNKLFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtRQUNILFFBQWpELEtBQUssVUFB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QUUsRUFBRSxJQUFLOzs7O1FBSUwsUUFBbEMsS0FBSyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbEMsS0FBSyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbEMsS0FBSyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbEMsS0FBSyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbEMsS0FBSyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLOzs7O1FBSUQsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLOzs7O1FBSUYsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBbkMsS0FBSyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLOzs7O1FBSXJDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRUksUUFBbEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBRXpDLFVBQVUsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHO1FBRVQsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxHQUFHLE1BQU8sRUFBRSxHQUFHO1FBQ1IsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxHQUFHLE1BQU8sRUFBRSxHQUFHO1FBQ1IsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxHQUFHLE1BQU8sRUFBRSxHQUFHO1FBQ1IsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxHQUFHLE1BQU8sRUFBRSxHQUFHO1FBRTVDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRU0sUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQVEsRUFBRSxFQUFFO1FBQ1AsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQVEsRUFBRSxFQUFFO1FBQ1AsUUFBcEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQVEsRUFBRSxFQUFFO1FBRTNDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRVksUUFBbEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbEMsS0FBSyxpQkFBaUIsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFOzs7O1FBSXpDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRUssUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxFQUFFLEtBQU0sRUFBRSxFQUFFO1FBQ1AsUUFBbkMsS0FBSyxrQkFBa0IsT0FBTyxF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
//# sourceURL=../../../kode/ked/test/belt.kode
