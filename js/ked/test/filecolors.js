var toExport = {}
var back, changed, colors, joined, lines, text

import filecolors from "../util/filecolors.js"

toExport["filecolors"] = async function ()
{
    await section("js uses a block comment", async function ()
    {
        compare(filecolors.commentStyle('x.js').start,'/*')
        compare(filecolors.commentStyle('x.js').end,'*/')
    })
    await section("python uses a hash comment", async function ()
    {
        compare(filecolors.commentStyle('x.py').start,'#')
        compare(filecolors.commentStyle('x.py').end,'')
    })
    await section("json has no comment style", async function ()
    {
        compare(filecolors.commentStyle('x.json'),null)
    })
    await section("other file types use their kolor comment style", async function ()
    {
        compare(filecolors.commentStyle('x.css').start,'/*')
        compare(filecolors.commentStyle('x.lua').start,'--')
        compare(filecolors.commentStyle('x.html').start,'<!--')
        compare(filecolors.commentStyle('x.kode').start,'#')
    })
    await section("join and split roundtrip", async function ()
    {
        colors = {fg:[[0,0,3,'#f00']],bg:[[4,0,5,'#00f']]}
        text = 'abc def'
        joined = filecolors.join('x.js',text,colors)
        lines = joined.split('\n')
        compare(lines.length,3)
        compare(lines[1].startsWith('/* ked-colors '),true)
        compare(lines[1].endsWith(' */'),true)
        back = filecolors.split('x.js',joined)
        compare(back.text,text)
        compare(back.colors,colors)
    })
    await section("a trailing newline is kept", async function ()
    {
        colors = {fg:[[0,0,3,'#f00']],bg:[]}
        text = 'abc\n'
        joined = filecolors.join('x.js',text,colors)
        back = filecolors.split('x.js',joined)
        compare(back.text,text)
        compare(back.colors,colors)
    })
    await section("no colors means no comment", async function ()
    {
        compare(filecolors.join('x.js','abc',{fg:[],bg:[]}),'abc')
    })
    await section("unsupported file types are left alone", async function ()
    {
        colors = {fg:[[0,0,3,'#f00']],bg:[]}
        compare(filecolors.join('x.json','{"a":1}',colors),'{"a":1}')
    })
    await section("a changed file discards the colors but strips the comment", async function ()
    {
        colors = {fg:[[0,0,3,'#f00']],bg:[]}
        joined = filecolors.join('x.js','abc',colors)
        changed = joined.replace('abc','abd')
        back = filecolors.split('x.js',changed)
        compare(back.text,'abd')
        compare(back.colors.fg,[])
        compare(back.colors.bg,[])
    })
}
toExport["filecolors"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWNvbG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9maWxlY29sb3JzLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQU9jLGlCQUFQOzs7Ozs7Z0JBTUMsV0FBVyxhQUFhLFFBQVEsTUFBUTtnQkFDeEMsV0FBVyxhQUFhLFFBQVEsSUFBTTs7OztnQkFJdEMsV0FBVyxhQUFhLFFBQVEsTUFBUTtnQkFDeEMsV0FBVyxhQUFhLFFBQVEsSUFBTTs7OztnQkFJdEMsV0FBVyxhQUFhLFVBQVk7Ozs7Z0JBSXBDLFdBQVcsYUFBYSxTQUFTLE1BQVE7Z0JBQ3pDLFdBQVcsYUFBYSxTQUFTLE1BQVE7Z0JBQ3pDLFdBQVcsYUFBYSxVQUFVLE1BQVE7Z0JBQzFDLFdBQVcsYUFBYSxVQUFVLE1BQVE7Ozs7UUFJMUMsVUFDSSxLQUFNLEVBQUUsRUFBRSxFQUFFLFNBQ1osS0FBTSxFQUFFLEVBQUUsRUFBRTtRQUVoQixPQUFPO1FBRVAsU0FBUyxXQUFXLEtBQUssT0FBTyxLQUFLO1FBRXJDLFFBQVEsT0FBTyxNQUFNO2dCQUNyQixNQUFNLE9BQVM7Z0JBQ2YsTUFBTSxHQUFHLFdBQVcsa0JBQW9CO2dCQUN4QyxNQUFNLEdBQUcsU0FBUyxPQUFTO1FBRTNCLE9BQU8sV0FBVyxNQUFNLE9BQU87Z0JBRS9CLEtBQUssS0FBTztnQkFDWixLQUFLLE9BQVM7Ozs7UUFJZCxVQUFTLEtBQU0sRUFBRSxFQUFFLEVBQUUsU0FBUztRQUU5QixPQUFPO1FBRVAsU0FBUyxXQUFXLEtBQUssT0FBTyxLQUFLO1FBRXJDLE9BQU8sV0FBVyxNQUFNLE9BQU87Z0JBRS9CLEtBQUssS0FBTztnQkFDWixLQUFLLE9BQVM7Ozs7Z0JBSWQsV0FBVyxLQUFLLE9BQU8sT0FBTyxNQUFNLFFBQVM7Ozs7UUFJN0MsVUFBUyxLQUFNLEVBQUUsRUFBRSxFQUFFLFNBQVM7Z0JBRTlCLFdBQVcsS0FBSyxTQUFTLFVBQVUsUUFBUzs7OztRQUk1QyxVQUFTLEtBQU0sRUFBRSxFQUFFLEVBQUUsU0FBUztRQUU5QixTQUFTLFdBQVcsS0FBSyxPQUFPLE1BQU07UUFDdEMsVUFBVSxPQUFPLFFBQVEsTUFBTTtRQUUvQixPQUFPLFdBQVcsTUFBTSxPQUFPO2dCQUUvQixLQUFLLEtBQU87Z0JBQ1osS0FBSyxPQUFPO2dCQUNaLEtBQUssT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/filecolors.kode
