var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4))

var assign, precedence

import print from "./print.js"


precedence = function (o)
{
    var t, _23_20_

    if ((o != null ? o.qmrkcolon : undefined))
    {
        return 12
    }
    t = (o != null ? (_23_20_=o.operation) != null ? _23_20_.operator.text : undefined : undefined)
    switch (t)
    {
        case 'new':
            return -1

        case 'last':
        case 'first':
        case 'is':
        case 'equals':
        case 'noon':
            return 0

        case 'copy':
        case 'clone':
        case 'not':
        case 'delete':
        case 'empty':
        case 'valid':
        case '~':
            return 1

        case '*':
        case '/':
        case '%':
            return 2

        case '+':
        case '-':
            return 3

        case '<<':
        case '>>':
        case '>>>':
            return 4

        case '<':
        case '<=':
        case '>':
        case '>=':
            return 5

        case '==':
        case '!=':
        case 'eql':
            return 6

        case '&':
            return 7

        case '^':
            return 8

        case '|':
            return 9

        case 'and':
            return 10

        case 'or':
            return 11

        case '?':
        case '?:':
            return 12

        case '=':
            return 13

        case '+=':
        case '-=':
        case '*=':
        case '/=':
        case '%=':
        case '&=':
        case '^=':
        case '|=':
            return 14

        case '<<=':
        case '>>=':
        case '>>>=':
        case '&&=':
        case '||=':
        case '?=':
            return 15

        default:
            return Infinity
    }

}
assign = ['=','+=','-=','*=','/=','%=','^=','&=','|=','&&=','||=']
class Operator
{
    constructor (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
    }

    collect (tl)
    {
        var e, _71_19_

        if ((tl != null ? (_71_19_=tl.exps) != null ? _71_19_.length : undefined : undefined))
        {
            var list = _k_.list(tl.exps)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                e = list[_a_]
                this.exp(e)
            }
        }
        return tl
    }

    exp (e)
    {
        var key, v, val, _89_30_

        if (!e)
        {
            return
        }
        else if (e.type)
        {
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    v = list[_a_]
                    this.exp(v)
                }
            }
        }
        else if (e.operation)
        {
            this.op(e)
            if ((e.operation != null ? e.operation.rhs : undefined))
            {
                return this.exp(e.operation.rhs)
            }
            else if (e.qmrkcolon)
            {
                this.exp(e.qmrkcolon.mid)
                return this.exp(e.qmrkcolon.rhs)
            }
        }
        else if (e instanceof Object)
        {
            for (key in e)
            {
                val = e[key]
                if (val)
                {
                    if (val.operation)
                    {
                        this.op(val)
                    }
                    else
                    {
                        this.exp(val)
                    }
                }
            }
        }
    }

    op (e)
    {
        var c, chain, i, p, _111_19_, _111_39_, _113_40_

        chain = [e]
        c = e.operation
        while ((c.rhs != null ? c.rhs.operation : undefined) || (c.rhs != null ? c.rhs.qmrkcolon : undefined))
        {
            chain.push(c.rhs)
            c = c.rhs.operation || (c.rhs != null ? c.rhs.qmrkcolon : undefined)
        }
        if (chain.length > 1)
        {
            p = chain.map(function (i)
            {
                return precedence(i)
            })
            if (this.debug)
            {
                this.logChain(chain,p)
            }
            for (var _a_ = i = 1, _b_ = p.length; (_a_ <= _b_ ? i < p.length : i > p.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (p[i] > p[i - 1])
                {
                    this.fixPrec(e)
                    break
                }
            }
        }
        else
        {
            return this.exp(e.operation.rhs)
        }
    }

    fixPrec (e)
    {
        var newlhs, newop, op, _142_23_, _142_41_, _142_52_, _142_62_, _146_32_, _146_43_, _182_54_, _182_84_, _188_32_, _188_53_

        op = e.operation || e.qmrkcolon
        if (precedence(e) < precedence(op.rhs))
        {
            if (op.operator.text === 'not' && _k_.in(((op.rhs != null ? op.rhs.incond : undefined) || ((_142_41_=op.rhs) != null ? (_142_52_=_142_41_.operation) != null ? (_142_62_=_142_52_.operator) != null ? _142_62_.text : undefined : undefined : undefined)),assign))
            {
                return
            }
            if (_k_.in(op.operator.text,assign))
            {
                return
            }
            if (_k_.in(((_146_32_=e.operation.rhs) != null ? (_146_43_=_146_32_.operation) != null ? _146_43_.operator.text : undefined : undefined),assign))
            {
                return
            }
            this.verb('swap',precedence(e),precedence(op.rhs))
            if (this.debug)
            {
                print.ast('before swap',e)
            }
            if (op.rhs.qmrkcolon)
            {
                newlhs = {operation:{lhs:op.lhs,operator:op.operator,rhs:op.rhs.qmrkcolon.lhs}}
                newop = {lhs:newlhs,qmrk:op.rhs.qmrkcolon.qmrk,mid:op.rhs.qmrkcolon.mid,colon:op.rhs.qmrkcolon.colon,rhs:op.rhs.qmrkcolon.rhs}
                delete e.operation
                e.qmrkcolon = newop
            }
            else
            {
                newlhs = {operation:{lhs:op.lhs,operator:op.operator,rhs:op.rhs.operation.lhs}}
                newop = {lhs:newlhs,operator:op.rhs.operation.operator,rhs:op.rhs.operation.rhs}
                e.operation = newop
                if ((e.operation.rhs != null ? e.operation.rhs.operation : undefined) || (e.operation.rhs != null ? e.operation.rhs.qmrkcolon : undefined))
                {
                    this.op(e.operation.rhs)
                }
            }
            if (this.debug)
            {
                return print.ast('after swap2',e)
            }
        }
        else
        {
            if ((op.rhs != null ? op.rhs.operation : undefined) || (op.rhs != null ? op.rhs.qmrkcolon : undefined))
            {
                this.op(op.rhs)
            }
            if (precedence(e) < precedence(op.rhs))
            {
                return this.fixPrec(e)
            }
        }
    }

    logChain (chain, p)
    {
        var rndr, s, _206_43_, _206_50_

        s = ''
        rndr = (function (n)
        {
            try
            {
                return _k_.w2(this.kode.renderer.plain,this.kode.renderer.node(n))
            }
            catch (e)
            {
                return print.noon(e,n)
            }
        }).bind(this)
        s += chain.map((function (i)
        {
            if (i.operation)
            {
                return rndr(i.operation.lhs) + ' ' + _k_.w3(i.operation.operator.text) + ' ' + _k_.b6(precedence(i))
            }
            else
            {
                return rndr(i.qmrkcolon.lhs) + ' ? ' + rndr(i.qmrkcolon.mid) + ' '
            }
        }).bind(this)).join(' ')
        s += ' ' + ((_206_50_=rndr((chain.slice(-1)[0].operation != null ? chain.slice(-1)[0].operation.rhs : undefined))) != null ? _206_50_ : '...')
        if (this.debug)
        {
            console.log(_k_.w4('▪'),s,_k_.g3(p))
        }
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }
}

export default Operator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9vcGVyYXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBa0JBOzs7O1NBRWlCLFlBQUEsRUFBRzs7ZUFBVDs7SUFFUCxLQUFJLHFCQUFBLEVBQUcsNkJBQVcsU0FBUztZQUVwQjs7YUFFSDttQkFBNEM7O2FBQzVDO2FBQU87YUFDUDthQUFLO2FBQVM7bUJBQStCOzthQUM3QzthQUFPO2FBQ1A7YUFBTTthQUFTO2FBQVE7YUFBUTttQkFBYzs7YUFDN0M7YUFBSTthQUFJO21CQUFxQzs7YUFDN0M7YUFBSTttQkFBeUM7O2FBQzdDO2FBQUs7YUFBSzttQkFBbUM7O2FBQzdDO2FBQUk7YUFBSzthQUFJO21CQUFnQzs7YUFDN0M7YUFBSzthQUFLO21CQUFtQzs7YUFDN0M7bUJBQTZDOzthQUM3QzttQkFBNkM7O2FBQzdDO21CQUE2Qzs7YUFDN0M7bUJBQTRDOzthQUM1QzttQkFBNEM7O2FBQzVDO2FBQUk7bUJBQXdDOzthQUM1QzttQkFBNEM7O2FBQzVDO2FBQUs7YUFBSzthQUFLO2FBQUs7YUFBSzthQUFLO2FBQUs7bUJBQVM7O2FBQzVDO2FBQU07YUFBTTthQUFPO2FBQU07YUFBTTttQkFBYTs7O21CQUNBOzs7O0FBRXBELFVBQVUsSUFBRyxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksTUFBSzs7Ozs7OztRQVkxQyxLQUFDLFVBQVUsS0FBQyxLQUFLLEtBQUs7UUFDdEIsS0FBQyxRQUFVLEtBQUMsS0FBSyxLQUFLOzs7Ozs7O2FBVW5CLHNCQUFBLEdBQUksd0JBQU07O2dDQUNPLEdBQUc7Ozs7Z0JBQW5CLEtBQUMsSUFBSTs7O2VBQ1Q7Ozs7Ozs7YUFXUTs7OztpQkFDSixFQUFFOzs7O2lCQUNGLGFBQUs7O2dCQUE4QixFQUFFOztvQ0FBUDs7OztvQkFBaEIsS0FBQyxJQUFJOzs7O2lCQUNuQixFQUFFOztZQUNFLEtBQUMsR0FBRztpQkFDRCxFQUFFLG9CQUFG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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/operator.kode
