var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var fontmap

import fs from "fs"
import os from "os"

import child_process from "child_process"
let spawnSync = child_process.spawnSync

import kxk from "../../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash


fontmap = (function ()
{
    function fontmap ()
    {}

    fontmap["extra"] = " !?-+_=/><^[](){}\"'#*$@%&:;.,◆●■◇◯□△▸▴◂➜✔✘"
    fontmap["chars"] = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + fontmap.extra)
    fontmap["font"] = 'JetBrainsMono NFM ExtraBold'
    fontmap["sizes"] = [[8,16],[10,20],[12,24],[14,28]]
    fontmap["out"] = slash.path(_k_.dir(),'../../../../img')
    fontmap["mapFile"] = slash.path(_k_.dir(),'../../../../kode/ked/util/img/fontmap.noon')
    fontmap["tmp"] = function (name)
    {
        return slash.path(os.tmpdir(),`ked-fontmap-${name}.png`)
    }

    fontmap["exec"] = function (cmd, args)
    {
        var result

        result = child_process.spawnSync(cmd,args,{maxBuffer:0x10000000})
        if (result.status !== 0)
        {
            console.error(`fontmap: ${cmd} failed with ${result.status}`)
            console.error(String(result.stderr))
            return
        }
        return result
    }

    fontmap["render"] = function (text, px, file)
    {
        var h, result, w

        this.exec('pango-view',['-q','--pixels',`--font=${this.font} ${px}`,'--background=black','--foreground=white','--margin=0',`--text=${text}`,'-o',file])
        result = this.exec('magick',['identify','-format','%wx%h',file])
        if (!result)
        {
            return
        }
        var _a_ = String(result.stdout).trim().split('x'); w = _a_[0]; h = _a_[1]

        return [parseInt(w),parseInt(h)]
    }

    fontmap["grayscale"] = function (file, w, h)
    {
        var result

        result = this.exec('magick',[file,'-filter','Triangle','-resize',`${w}x${h}!`,'-depth','8','gray:-'])
        if (!result)
        {
            return
        }
        return result.stdout
    }

    fontmap["buildMap"] = function (w, h)
    {
        var ch, cov, data, glyphs, i, result, sequence, total, x, y

        sequence = this.chars.join(' ')
        result = this.render(sequence,h,this.tmp('glyphs'))
        if (!result)
        {
            return
        }
        total = w * (this.chars.length * 2 - 1)
        data = this.grayscale(this.tmp('glyphs'),total,h)
        if (!data)
        {
            return
        }
        glyphs = {}
        var list = _k_.list(this.chars)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            cov = new Uint8Array(new ArrayBuffer(w * h))
            for (var _b_ = y = 0, _c_ = h; (_b_ <= _c_ ? y < h : y > h); (_b_ <= _c_ ? ++y : --y))
            {
                for (var _d_ = x = 0, _e_ = w; (_d_ <= _e_ ? x < w : x > w); (_d_ <= _e_ ? ++x : --x))
                {
                    cov[y * w + x] = data[y * total + (i * 2) * w + x]
                }
            }
            glyphs[ch] = cov
        }
        return glyphs
    }

    fontmap["rowsFor"] = function (cov, w, h)
    {
        var row, rows, x, y

        rows = []
        for (var _a_ = y = 0, _b_ = h; (_a_ <= _b_ ? y < h : y > h); (_a_ <= _b_ ? ++y : --y))
        {
            row = '0x'
            for (var _c_ = x = 0, _d_ = w; (_c_ <= _d_ ? x < w : x > w); (_c_ <= _d_ ? ++x : --x))
            {
                row += cov[y * w + x].toString(16).padStart(2,'0')
            }
            rows.push(row)
        }
        return rows
    }

    fontmap["noonFor"] = function (maps)
    {
        var ch, data, gl, key, map

        data = {}
        for (key in maps)
        {
            map = maps[key]
            gl = {}
            var list = _k_.list(this.chars)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                ch = list[_a_]
                gl[ch] = this.rowsFor(map.glyphs[ch],map.width,map.height)
            }
            data[key] = {width:map.width,height:map.height,font:map.font,file:map.file,glyphs:gl}
        }
        return noon.stringify(data,{indent:4,maxalign:8}) + '\n'
    }

    fontmap["savePNG"] = function (file, image)
    {
        var result

        result = child_process.spawnSync('magick',['-size',`${image.w}x${image.h}`,'-depth','8','rgba:-','-strip',file],{input:image.rgba,maxBuffer:0x10000000})
        if (result.status !== 0)
        {
            console.error(`fontmap: magick could not write ${file}`)
            console.error(String(result.stderr))
        }
    }

    fontmap["preview"] = function (glyphs, w, h)
    {
        var c, ch, cols, cov, cx, cy, gap, gz, i, ph, pixels, pw, rows, v, x, xx, y, yy

        gz = 4
        cols = 13
        gap = 1
        rows = Math.ceil(this.chars.length / cols)
        pw = cols * w * gz + (cols - 1) * gap
        ph = rows * h * gz + (rows - 1) * gap
        pixels = new Uint32Array(new ArrayBuffer(pw * ph * 4))
        pixels.fill(0xff000000)
        var list = _k_.list(this.chars)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            cx = (i % cols) * (w * gz + gap)
            cy = parseInt(i / cols) * (h * gz + gap)
            cov = glyphs[ch]
            for (var _b_ = y = 0, _c_ = h; (_b_ <= _c_ ? y < h : y > h); (_b_ <= _c_ ? ++y : --y))
            {
                for (var _d_ = x = 0, _e_ = w; (_d_ <= _e_ ? x < w : x > w); (_d_ <= _e_ ? ++x : --x))
                {
                    c = cov[y * w + x]
                    v = c | c << 8 | c << 16 | 0xff000000
                    for (var _f_ = yy = 0, _10_ = gz; (_f_ <= _10_ ? yy < gz : yy > gz); (_f_ <= _10_ ? ++yy : --yy))
                    {
                        for (var _11_ = xx = 0, _12_ = gz; (_11_ <= _12_ ? xx < gz : xx > gz); (_11_ <= _12_ ? ++xx : --xx))
                        {
                            pixels[(cy + y * gz + yy) * pw + cx + x * gz + xx] = v
                        }
                    }
                }
            }
        }
        return {w:pw,h:ph,rgba:pixels}
    }

    fontmap["generate"] = function ()
    {
        var glyphs, h, maps, pngFile, size, w

        fs.mkdirSync(this.out,{recursive:true})
        console.log(`${this.font}`)
        maps = {}
        var list = _k_.list(this.sizes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            w = list[_a_][0]
            h = list[_a_][1]
            glyphs = this.buildMap(w,h)
            if (!glyphs)
            {
                return
            }
            size = `${w}x${h}`
            console.log(size)
            maps[size] = {width:w,height:h,font:this.font,glyphs:glyphs}
            pngFile = slash.path(this.out,`fontmap-${size}.png`)
            this.savePNG(pngFile,this.preview(glyphs,w,h))
        }
        return fs.writeFileSync(this.mapFile,this.noonFor(maps))
    }

    return fontmap
})()

if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    fontmap.generate()
}
export default fontmap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udG1hcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvZm9udG1hcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ0ksU0FBQTtPQUFHLFNBQUE7O09BQ0gsb0JBQUE7SUFBZ0I7O09BQ1AsVUFBQTtJQUFPO0lBQUs7OztBQUV4QixXQUFEOzs7OztJQUtJLFNBQUMsVUFBUztJQUNWLFNBQUMsVUFBUyxNQUFNLEtBQUssbUVBQW1FLFFBQVE7SUFFaEcsU0FBQyxTQUFTO0lBRVYsU0FBQyxZQUFXLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUc7SUFFdEMsU0FBQyxRQUFTLE1BQU0sS0FBTSxVQUFJO0lBQzFCLFNBQUMsWUFBUyxNQUFNLEtBQU0sVUFBSTtJQUUxQixTQUFDLGtCQUFLOztlQUFRLE1BQU0sS0FBSyxHQUFHLHdCQUF5Qjs7O0lBRXJELFNBQUMsbUJBQU0sS0FBSTs7OztRQUVQLFNBQVMsY0FBYyxVQUFVLElBQUksTUFBSyxVQUFVO1lBRWpELE9BQU8sV0FBVTs7WUFDaEIsMEJBQWtCLG1CQUFtQixPQUFPO1lBQzVDLGNBQU0sT0FBTyxPQUFPOzs7ZUFHeEI7OztJQUVKLFNBQUMscUJBQVEsTUFBSyxJQUFHOzs7O1FBRWIsS0FBQyxLQUFLLGNBQWMsS0FBSyxxQkFBcUIsS0FBQyxRQUFRLEtBQUsscUJBQXFCLHFCQUFxQix1QkFBdUIsT0FBTyxLQUFLO1FBRXpJLFNBQVMsS0FBQyxLQUFLLFVBQVUsV0FBVyxVQUFVLFFBQVE7YUFDN0M7Ozs7a0JBRUQsT0FBTyxPQUFPLFFBQVEsT0FBTyxNQUFNLE1BQTFDLFlBQUU7O3lCQUNFLFlBQU87OztJQUVoQixTQUFDLHdCQUFXLE1BQUssR0FBRTs7OztRQUVmLFNBQVMsS0FBQyxLQUFLLFVBQVUsS0FBSyxVQUFVLFdBQVcsYUFBYSxLQUFLLEtBQUssU0FBUyxJQUFJO2FBQzlFOzs7O2VBRVQsT0FBTzs7O0lBRVgsU0FBQyx1QkFBVSxHQUFFOzs7O1FBRVQs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
//# sourceURL=../../../../kode/ked/util/img/fontmap.kode
