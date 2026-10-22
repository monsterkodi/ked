var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.r1=_k_.k.F256(_k_.k.r(1));_k_.R1=_k_.k.B256(_k_.k.R(1));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.g1=_k_.k.F256(_k_.k.g(1));_k_.G1=_k_.k.B256(_k_.k.G(1));_k_.G3=_k_.k.B256(_k_.k.G(3));_k_.g6=_k_.k.F256(_k_.k.g(6));_k_.B2=_k_.k.B256(_k_.k.B(2));_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.Y2=_k_.k.B256(_k_.k.Y(2));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.W2=_k_.k.B256(_k_.k.W(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.W4=_k_.k.B256(_k_.k.W(4))

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"
import noon from "../kxk/noon.js"

class Print
{
    static tokens (header, tokens)
    {
        var idx, s, tok

        console.log(_k_.R3(_k_.y5(`\n ${header}`)))
        console.log(_k_.b6(_k_.rpad(80)))
        s = ''
        var list = _k_.list(tokens)
        for (idx = 0; idx < list.length; idx++)
        {
            tok = list[idx]
            s += this.token(tok,idx)
        }
        console.log(s)
    }

    static token (tok, idx = '')
    {
        var indent, toktext

        indent = _k_.lpad(tok.col)
        if (tok.type === 'nl')
        {
            return red('◂\n')
        }
        if (_k_.in(tok.type,['ws','nl']))
        {
            return ''
        }
        toktext = (function (tok)
        {
            var s, t

            if (tok.text === '')
            {
                return '\n' + indent
            }
            else if (tok.text)
            {
                return tok.text
            }
            else if (tok.tokens)
            {
                s = ''
                var list = _k_.list(tok.tokens)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    t = list[_a_]
                    s += this.token(t)
                }
                return '\n' + s
            }
            else
            {
                return '???'
            }
        }).bind(this)
        return _k_.b6(_k_.lpad(4,tok.line)) + ' ' + blue(_k_.lpad(3,tok.col)) + ' ' + _k_.w2(_k_.lpad(4,idx)) + ' ' + gray(_k_.rpad(10,tok.type)) + ' ' + bold(yellow(indent + toktext(tok)) + '\n')
    }

    static stack (stack, node, color = W4)
    {
        console.log(_k_.W2(stack.join(' ') + ' ') + color((node != null ? node : '')))
    }

    static sheap (sheap, popped)
    {
        var c, r, s

        s = _k_.B2('   ')
        var list = _k_.list(sheap)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            r = list[_a_]
            switch (r.type)
            {
                case 'exps':
                    s += _k_.B5(r.text) + _k_.B2(' ')
                    break
                case 'stack':
                    s += _k_.W4(r.text) + _k_.W2(' ')
                    break
                case 'rhs':
                    s += _k_.R3(_k_.r1(r.text)) + _k_.R1(' ')
                    break
                case 'lhs':
                    s += _k_.G3(_k_.g1(r.text)) + _k_.G1(' ')
                    break
                default:
                    s += _k_.Y4(black(r.text) + _k_.Y2(' '))
            }

        }
        if (popped)
        {
            c = ((function ()
            {
                switch (popped.type)
                {
                    case 'exps':
                        return B1

                    case 'stack':
                        return W3

                    default:
                        return W1
                }

            }).bind(this))()
            s += black(c(popped.text) + ' ')
        }
        console.log(s)
    }

    static block (header, block, legend = false)
    {
        var printBlock

        console.log(_k_.R3(_k_.y5(`\n ${header}`)))
        printBlock = function (b)
        {
            var c, ci, cn, s, _89_27_, _96_44_

            if (legend)
            {
                s = b.indent + _k_.b6(_k_.rpad(3,b.line)) + _k_.w2(_k_.rpad(3,b.col)) + yellow(b.tokens.length)
                s += '\n' + b.indent
            }
            s = b.indent
            if (_k_.in(b.type,['{}','()','[]']))
            {
                s += b.type[0] + ' '
            }
            var list = _k_.list(b.tokens)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                c = list[_a_]
                if ((c.tokens != null))
                {
                    s += '\n' + printBlock(c) + b.indent
                }
                else if (c.type === 'nl')
                {
                    s += '\n' + b.indent + '▸'
                }
                else
                {
                    ci = parseInt(b.indent.length / 4)
                    cn = ['g5','r5','m5','g3','r3','m3','g1','r1','m1'][ci % 8]
                    s += global[cn]((((_96_44_=c.text) != null ? _96_44_ : '')) + ' ')
                }
            }
            if (_k_.in(b.type,['{}','()','[]']))
            {
                s += b.type[1]
            }
            return s
        }
        console.log(printBlock(block))
    }

    static ast (header, ast)
    {
        var lp, node, printNode

        console.log(_k_.G1(_k_.g6(`\n ${header}`)))
        lp = _k_.lpad(19)
        printNode = function (node, indent = '', visited = [])
        {
            var name, s, value, _120_41_, _120_77_

            s = ''
            if (!node)
            {
                return s
            }
            if (node.type)
            {
                s += _k_.b6(_k_.lpad(4,((_120_41_=node.line) != null ? _120_41_ : ''))) + ' ' + blue(_k_.lpad(3,((_120_77_=node.col) != null ? _120_77_ : ''))) + ' ' + gray(_k_.rpad(10,node.type)) + ' ' + bold(yellow(indent + node.text)) + '\n'
            }
            else if (node instanceof Array)
            {
                if (_k_.in(node,visited))
                {
                    return s
                }
                visited.push(node)
                if (node.length)
                {
                    s += lp + ' ' + indent + bold(_k_.w3('['))
                    var list = _k_.list(node)
                    for (var _a_ = 0; _a_ < list.length; _a_++)
                    {
                        value = list[_a_]
                        s += '\n'
                        s += printNode(value,indent,visited)
                    }
                    s += lp + ' ' + bold(_k_.w3(indent + ']\n'))
                }
                else
                {
                    s += lp + ' ' + indent + bold(_k_.w3('[]\n'))
                }
            }
            else
            {
                if (_k_.in(node,visited))
                {
                    return s
                }
                visited.push(node)
                for (name in node)
                {
                    value = node[name]
                    s += lp + ' ' + bold(_k_.b8(indent + name))
                    s += '\n'
                    s += printNode(value,indent + '  ',visited)
                }
            }
            return s
        }
        if (ast instanceof Array)
        {
            var list = _k_.list(ast)
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                node = list[_b_]
                console.log(printNode(node))
            }
        }
        else
        {
            console.log(printNode(ast))
        }
    }

    static astr (ast, scopes)
    {
        var node, printNode, s

        printNode = function (node, indent = '', visited = [])
        {
            var name, s, value, _177_28_, _177_43_

            s = ''
            if (!node)
            {
                return s
            }
            if (node.type)
            {
                s += indent + node.text + '\n'
            }
            else if (node instanceof Array)
            {
                if (_k_.in(node,visited))
                {
                    return s
                }
                visited.push(node)
                if (node.length)
                {
                    var list = _k_.list(node)
                    for (var _a_ = 0; _a_ < list.length; _a_++)
                    {
                        value = list[_a_]
                        s += printNode(value,indent,visited)
                    }
                }
            }
            else
            {
                if (_k_.in(node,visited))
                {
                    return s
                }
                visited.push(node)
                if ((node.vars != null) && (node.exps != null) && !scopes)
                {
                    s = printNode(node.exps,indent,visited)
                }
                else
                {
                    for (name in node)
                    {
                        value = node[name]
                        s += indent + name
                        s += '\n'
                        s += printNode(value,indent + '    ',visited)
                    }
                }
            }
            return s
        }
        if (ast instanceof Array)
        {
            s = (function () { var r_b_ = []; var list = _k_.list(ast); for (var _c_ = 0; _c_ < list.length; _c_++)  { node = list[_c_];r_b_.push(printNode(node))  } return r_b_ }).bind(this)().join('')
        }
        else
        {
            s = printNode(ast)
        }
        return _k_.trim(s,' \n')
    }

    static noon (msg, arg)
    {
        if (!arg)
        {
            arg = msg
            msg = null
        }
        if (msg)
        {
            console.log(red(msg))
        }
        console.log(noon.stringify(arg,{colors:true}))
    }
}

export default Print;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9wcmludC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFVQSxNQUFNOztJQVFGLGVBQVMsUUFBTzs7OztRQUVaLGdDQUFnQjtRQUNoQiw0QkFBWTtRQUNaLElBQUk7NEJBQ1c7OztZQUFYO1lBQ0EsS0FBSyxLQUFDLE1BQU0sSUFBSzs7UUFDckIsWUFBSTs7O0lBRVIsY0FBUSxLQUFJOzs7O1FBRVIsa0JBQWMsSUFBSTtZQUNFLElBQUksU0FBUTs7bUJBQXpCLElBQUk7O21CQUNFLElBQUksTUFBUyxLQUFJOzttQkFBdkI7O1FBQ1AscUJBQVc7Ozs7Z0JBQ0osSUFBSSxTQUFROzt1QkFBUSxPQUFLOztxQkFDcEIsSUFBSTs7dUJBQVUsSUFBSTs7cUJBQ2xCLElBQUk7O2dCQUNSLElBQUk7b0NBQ0ssSUFBSTs7O29CQUFUO29CQUNBLEtBQUssS0FBQyxNQUFNOzt1QkFDaEIsT0FBTzs7Ozt1QkFFUDs7OytCQUNBLEVBQUUsSUFBSSxTQUFTLE1BQU0sY0FBVSxFQUFFLElBQUksUUFBUSxzQkFBYyxFQUFFLFFBQVEsTUFBTSxjQUFVLEdBQUcsSUFBSSxTQUFTLE1BQU0sS0FBSyxPQUFPLFNBQVMsUUFBUSxRQUFROzs7SUFRNUosY0FBUSxPQUFNLE1BQUs7O1FBRWYsbUJBQU8sTUFBTSxLQUFLLE9BQU8sT0FBTyxPQUFNLGVBQUEsT0FBTzs7O0lBRWpELGNBQVEsT0FBTTs7OztRQUVWLFdBQU87NEJBQ0U7OztZQUFMO29CQUNPLEVBQUU7O3FCQUNBO29CQUFhLFlBQVEsRUFBRSxlQUFXOztxQkFDbEM7b0JBQWEsWUFBUSxFQUFFLGVBQVc7O3FCQUNsQztvQkFBYSxtQkFBVyxFQUFFLGdCQUFZOztxQkFDdEM7b0JBQWEsbUJBQVcsRUFBRSxnQkFBWTs7O29CQUN6QixZQUFRLE1BQU0sRUFBRSxlQUFXOzs7O1lBQ2xEOztZQUNDOzt3QkFBVyxPQUFPOzt5QkFDVDsrQkFBWTs7eUJBQ1o7K0JBQWE7Ozsr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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/print.kode
