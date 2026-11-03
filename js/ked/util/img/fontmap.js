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
            return null
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udG1hcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvZm9udG1hcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ0ksU0FBQTtPQUFHLFNBQUE7O09BQ0gsb0JBQUE7SUFBZ0I7O09BQ1AsVUFBQTtJQUFPO0lBQUs7OztBQUV4QixXQUFEOzs7OztJQUtJLFNBQUMsVUFBUztJQUNWLFNBQUMsVUFBUyxNQUFNLEtBQUssbUVBQW1FLFFBQVE7SUFFaEcsU0FBQyxTQUFTO0lBRVYsU0FBQyxZQUFXLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUc7SUFFdEMsU0FBQyxRQUFTLE1BQU0sS0FBTSxVQUFJO0lBQzFCLFNBQUMsWUFBUyxNQUFNLEtBQU0sVUFBSTtJQUUxQixTQUFDLGtCQUFLOztlQUFRLE1BQU0sS0FBSyxHQUFHLHdCQUF5Qjs7O0lBRXJELFNBQUMsbUJBQU0sS0FBSTs7OztRQUVQLFNBQVMsY0FBYyxVQUFVLElBQUksTUFBSyxVQUFVO1lBRWpELE9BQU8sV0FBVTs7WUFDaEIsMEJBQWtCLG1CQUFtQixPQUFPO1lBQzVDLGNBQU0sT0FBTyxPQUFPO21CQUNsQjs7ZUFFTjs7O0lBRUosU0FBQyxxQkFBUSxNQUFLLElBQUc7Ozs7UUFFYixLQUFDLEtBQUssY0FBYyxLQUFLLHFCQUFxQixLQUFDLFFBQVEsS0FBSyxxQkFBcUIscUJBQXFCLHVCQUF1QixPQUFPLEtBQUs7UUFFekksU0FBUyxLQUFDLEtBQUssVUFBVSxXQUFXLFVBQVUsUUFBUTthQUM3Qzs7OztrQkFFRCxPQUFPLE9BQU8sUUFBUSxPQUFPLE1BQU0sTUFBMUMsWUFBRTs7eUJBQ0UsWUFBTzs7O0lBRWhCLFNBQUMsd0JBQVcsTUFBSyxHQUFFOzs7O1FBRWYsU0FBUyxLQUFDLEtBQUssVUFBVSxLQUFLLFVBQVUsV0FBVyxhQUFhLEtBQUssS0FBSyxTQUFTLElBQUk7YUFDOUU7Ozs7ZUFFVCxPQUFPOzs7SUFFWCxTQUFDLHVCQUFVLEdBQUU7Ozs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/fontmap.kode
