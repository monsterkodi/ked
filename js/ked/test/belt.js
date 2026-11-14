var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var bad, batched, brackets, brk, c, cells, l, line, lines, lines2, matches, one, pairs, pos, posl, ranges, rect, res, rngs, segls, spans, spec, sps, strings, strs, text, wide, zero

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
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            pos = list1[_c_]
            var _d_ = belt.spansOfNestedPairsAtPositions(lines,[pos]); sps = _d_[0]; brk = _d_[1]; strs = _d_[2]

            one = one.concat(sps)
        }
        var _e_ = belt.spansOfNestedPairsAtPositions(lines,posl); batched = _e_[0]; brk = _e_[1]; strs = _e_[2]

        compare(batched,one)
        one = []
        var list2 = _k_.list(posl)
        for (var _f_ = 0; _f_ < list2.length; _f_++)
        {
            pos = list2[_f_]
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
        var _10_ = belt.spansOfNestedPairsAtPositions(segls,[[2,0]]); spans = _10_[0]; brackets = _10_[1]; strings = _10_[2]

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
        compare(belt.parseSubstitutePattern('foo'),null)
        compare(belt.parseSubstitutePattern(''),null)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9iZWx0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFTO0lBQUs7O09BQ0wsV0FBUDs7Ozs7O1FBTUosSUFBSSxLQUFLLGFBQWE7OztRQU10QixRQUFRLEtBQUssY0FBYztRQUUzQixPQUFPLEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFOzRCQUMzQjs7O1lBQUw7WUFDQSxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUU7O2dCQUV2QixNQUFNLEdBQUcsR0FBRyxJQUFNLElBQUksRUFBRTtnQkFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBTSxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sR0FBRyxHQUFHO2dCQUVaLEtBQUssY0FBYyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQzFDLEtBQUssY0FBYyxNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUU7Z0JBRTVDLEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsY0FBSzs7bUJBQU0sRUFBRSxLQUFLO1lBQVMsSUFBSSxJQUFJLElBQUk7Z0JBQ3ZFLEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsY0FBSzs7bUJBQU0sRUFBRSxLQUFLO1lBQVM7Z0JBQzNELEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsY0FBSzs7bUJBQU0sRUFBRSxLQUFLO1lBQVMsSUFBSSxJQUFJO2dCQUNuRSxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUk7Z0JBRS9ELEtBQUssbUJBQW1CLE1BQU0sRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSSxJQUFJOzs7O1FBSTFFLFNBQVMsTUFBTSxLQUFLO2dCQUVwQixLQUFLLHVDQUF1QyxNQUFNLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTyxFQUFFLEVBQUUsRUFBRTtnQkFDdEYsS0FBSyx1Q0FBdUMsTUFBTSxZQUFZLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTs7OztRQUk3SCxTQUFTO2tCQUVjLEtBQUssdUNBQXVDLFFBQVEsRUFBRSxTQUE1RSxpQkFBTyxlQUFLOztnQkFFYixRQUFVO2dCQUNWLE9BQVcsRUFBRTtnQkFDYjs7OztnQkFJQSxLQUFLLHVDQUF1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQzVFLEtBQUssdUNBQXVDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTyxFQUFFLEVBQUUsRUFBRTtnQkFDNUUsS0FBSyx1Q0FBdUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUM1RSxLQUFLLHVDQUF1QyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2dCQUMvRCxLQUFLLHVDQUF1QyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFOzs7O1FBTWhHLE9BQU87Z0JBRVAsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7Z0JBQ3JDLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxVQUFXO2dCQUNyQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsVUFBVztnQkFDckMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7Z0JBQ3JDLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxVQUFXO1FBRXJDLE9BQU87Z0JBRVAsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEdBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxHQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssR0FBRyxHQUFHLE9BQVM7UUFFbkMsT0FBTztnQkFFUCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxTQUFXO2dCQUV0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxVQUFZO2dCQUV2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/belt.kode
