var toExport = {}
var lines, newLines, oldLines, spans

import colorspans from "../edit/tool/colorspans.js"

toExport["colorspans"] = async function ()
{
    await section("overlay adds a span", async function ()
    {
        lines = [['a','b','c','d','e']]
        spans = colorspans.overlay([],[[1,0,4,0]],'#f00',lines)
        compare(spans,[[1,0,4,'#f00']])
    })
    await section("overlay splits an existing span", async function ()
    {
        lines = [['a','b','c','d','e']]
        spans = colorspans.overlay([[0,0,5,'#00f']],[[2,0,3,0]],'#f00',lines)
        compare(spans,[[0,0,2,'#00f'],[2,0,3,'#f00'],[3,0,5,'#00f']])
    })
    await section("overlay turns a multiline range into lines", async function ()
    {
        lines = [['a','b','c','d','e'],['a','b','c','d','e'],['a','b','c','d','e']]
        spans = colorspans.overlay([],[[2,0,3,2]],'#f00',lines)
        compare(spans,[[2,0,5,'#f00'],[0,1,5,'#f00'],[0,2,3,'#f00']])
    })
    await section("normalize merges touching spans of the same color", async function ()
    {
        spans = colorspans.normalize([[0,0,2,'#f00'],[2,0,4,'#f00'],[5,0,6,'#0f0']])
        compare(spans,[[0,0,4,'#f00'],[5,0,6,'#0f0']])
    })
    await section("clear removes and splits", async function ()
    {
        spans = colorspans.clear([[0,0,5,'#00f'],[6,0,9,'#00f']],[[2,0,7,0]])
        compare(spans,[[0,0,2,'#00f'],[7,0,9,'#00f']])
    })
    await section("an insertion inside a span stretches it", async function ()
    {
        oldLines = [['a','b','c','d']]
        newLines = [['a','b','X','c','d']]
        spans = colorspans.adjust([[0,0,4,'#f00']],oldLines,newLines)
        compare(spans,[[0,0,5,'#f00']])
    })
    await section("an insertion before a span moves it", async function ()
    {
        oldLines = [['a','b','c','d']]
        newLines = [['a','b','X','c','d']]
        spans = colorspans.adjust([[2,0,4,'#f00']],oldLines,newLines)
        compare(spans,[[3,0,5,'#f00']])
    })
    await section("a deletion inside a span shrinks it", async function ()
    {
        oldLines = [['a','b','c','d','e']]
        newLines = [['a','b','e']]
        spans = colorspans.adjust([[0,0,5,'#f00']],oldLines,newLines)
        compare(spans,[[0,0,3,'#f00']])
    })
    await section("inserting a line moves spans below", async function ()
    {
        oldLines = [['a'],['b'],['c']]
        newLines = [['a'],['x'],['b'],['c']]
        spans = colorspans.adjust([[0,1,1,'#f00'],[0,2,1,'#0f0']],oldLines,newLines)
        compare(spans,[[0,2,1,'#f00'],[0,3,1,'#0f0']])
    })
    await section("deleting a line moves spans below", async function ()
    {
        oldLines = [['a'],['x'],['b'],['c']]
        newLines = [['a'],['b'],['c']]
        spans = colorspans.adjust([[0,2,1,'#f00'],[0,3,1,'#0f0']],oldLines,newLines)
        compare(spans,[[0,1,1,'#f00'],[0,2,1,'#0f0']])
    })
    await section("colorAtPos finds the span at a position", async function ()
    {
        spans = [[1,2,4,'#f00'],[6,2,9,'#0f0']]
        compare(colorspans.colorAtPos(spans,[2,2]),'#f00')
        compare(colorspans.colorAtPos(spans,[5,2]),null)
        compare(colorspans.colorAtPos(spans,[6,2]),'#0f0')
    })
}
toExport["colorspans"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzcGFucy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9jb2xvcnNwYW5zLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQU1tQixpQkFBUDs7Ozs7O1FBTUosVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJO1FBRTFCLFFBQVEsV0FBVyxhQUFhLEVBQUUsRUFBRSxFQUFFLElBQUksT0FBTztnQkFFakQsUUFBVSxFQUFFLEVBQUUsRUFBRTs7OztRQUloQixVQUFVLElBQUksSUFBSSxJQUFJLElBQUk7UUFFMUIsUUFBUSxXQUFXLFVBQVUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxJQUFJLE9BQU87Z0JBRS9ELFFBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFOzs7O1FBSTlDLFVBQVUsSUFBSSxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJO1FBRXRFLFFBQVEsV0FBVyxhQUFhLEVBQUUsRUFBRSxFQUFFLElBQUksT0FBTztnQkFFakQsUUFBVSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJOUMsUUFBUSxXQUFXLFlBQVksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO2dCQUVuRSxRQUFVLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJL0IsUUFBUSxXQUFXLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO2dCQUVqRSxRQUFVLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJL0IsYUFBYSxJQUFJLElBQUksSUFBSTtRQUN6QixhQUFhLElBQUksSUFBSSxJQUFJLElBQUk7UUFFN0IsUUFBUSxXQUFXLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxTQUFTO2dCQUVwRCxRQUFVLEVBQUUsRUFBRSxFQUFFOzs7O1FBSWhCLGFBQWEsSUFBSSxJQUFJLElBQUk7UUFDekIsYUFBYSxJQUFJLElBQUksSUFBSSxJQUFJO1FBRTdCLFFBQVEsV0FBVyxTQUFTLEVBQUUsRUFBRSxFQUFFLFNBQVMsU0FBUztnQkFFcEQsUUFBVSxFQUFFLEVBQUUsRUFBRTs7OztRQUloQixhQUFhLElBQUksSUFBSSxJQUFJLElBQUk7UUFDN0IsYUFBYSxJQUFJLElBQUk7UUFFckIsUUFBUSxXQUFXLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxTQUFTO2dCQUVwRCxRQUFVLEVBQUUsRUFBRSxFQUFFOzs7O1FBSWhCLGFBQWEsTUFBTSxNQUFNO1FBQ3pCLGFBQWEsTUFBTSxNQUFNLE1BQU07UUFFL0IsUUFBUSxXQUFXLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLFNBQVM7Z0JBRW5FLFFBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTs7OztRQUkvQixhQUFhLE1BQU0sTUFBTSxNQUFNO1FBQy9CLGFBQWEsTUFBTSxNQUFNO1FBRXpCLFFBQVEsV0FBVyxTQUFTLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxTQUFTO2dCQUVuRSxRQUFVLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJL0IsVUFBVSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO2dCQUUvQixXQUFXLFdBQVcsT0FBTyxFQUFFLElBQUs7Z0JBQ3BDLFdBQVcsV0FBVyxPQUFPLEVBQUUsSUFBSztnQkFDcEMsV0FBVyxXQUFXLE9BQU8sRUFBRSxJQUFLIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colorspans.kode
