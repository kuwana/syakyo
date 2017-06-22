// プログラミングの写経用タイピングゲーム

/*
 * ゴール: githubのURL読み込みでリポジトリ内のテキストを写経できる。
 */

// まずは普通にタイピングゲーム

// 出力文字色を指定するメソッド
String.prototype.color = function(color) {
  let c
  switch (color) {
    case 'black'   : c = '\u001b[30m'; break
    case 'red'     : c = '\u001b[31m'; break
    case 'green'   : c = '\u001b[32m'; break
    case 'yellow'  : c = '\u001b[33m'; break
    case 'blue'    : c = '\u001b[34m'; break
    case 'magenta' : c = '\u001b[35m'; break
    case 'cyan'    : c = '\u001b[36m'; break
    case 'white'   : c = '\u001b[37m'; break
  }
  return c + this + '\u001b[0m'
}

// お題テキスト
let text = `\
test des {
  return test
}
`

let typed = 'te'

// text と typed を比較して、次に打つべき文字を確定
const nextChar = () => {
  let size = typed.length
  return text[size]
}

// タイプしたらtypedに一文字追加
const pushTyped = (input) => {
  typed += input
}

let res
[].forEach.call(text, (val, i) => {
  let size = typed.length
  res = typed.color('yellow') + text.slice(size).color('black')
})

// text と typed のの色分け表示
console.log(res)


