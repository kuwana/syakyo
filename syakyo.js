const blessed = require('blessed')

/*
 * プログラミングの写経用タイピングゲーム
 * ゴール: githubのURL読み込みでリポジトリ内のテキストを写経できる
 */

// 出力文字色を指定するメソッド DEPRECATE: blessedのタグを使う
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

const screen = blessed.screen({
  smartCSR: true
})

screen.title = 'syakyo'

// お題テキストをファイルから読み込む TODO: data内のお題テキストを選択するインターフェースを用意
var fs = require('fs');
var text = fs.readFileSync('data/test/go_interface_example.go', 'utf-8');

let typed = ''

// text と typed を比較して、次に打つべき文字を確定
const nextChar = () => {
  let size = typed.length
  return text[size]
}

// タイプしたらtypedに一文字追加
const pushTyped = (input) => {
  if (input !== nextChar()) {
    return false
  }
  typed += input
  return true
}

// 現在の入力状況（色分けテキスト）を取得
const snapshot = () => {
  let size = typed.length
  if (text.length === size) {
    // TODO: タイムと1分あたりのタイプ数を出力して終了するように
    process.exit(0)
  }
  return typed.color('yellow') + text.slice(size).color('black')
}

const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '100%',
  content: snapshot(),
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
})

box.on('keypress', function(ch, e) {
  if (e.name === 'enter') {
    ch = '\n'
  }
  if (pushTyped('' + ch)) {
    box.setContent(snapshot())
    screen.render()
  }
  // TODO: else でミス入力時の表示
})

screen.append(box)

// C-cでプログラム終了
screen.key('C-c', function() {
  screen.title = ''
  process.exit(0)
})

// TODO: Enter押したらゲームスタートするように
screen.render()
console.log('clear!')
