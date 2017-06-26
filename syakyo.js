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
var text = fs.readFileSync('data/test/test.go', 'utf-8');

let typed = miss = ''

// text と typed を比較して、次に打つべき文字を確定
const nextChar = () => {
  let size = typed.length
  return text[size]
}

// タイプしたらtypedに一文字追加
const pushTyped = (input) => {
  if (input !== nextChar()) {
    miss += input
    return false
  }
  typed += input
  return true
}

// 現在の入力状況（色分けテキスト）を取得
const snapshot = () => {
  let size = typed.length
  let br = ''
  if (text.length === size) {
    // TODO: タイムと1分あたりのタイプ数を出力して終了するように
    process.exit(0)
  }
  // FIXME
  if (typed[typed.length - 1] === '\n' && nextChar() === '\n' && typed[typed.length - 2] !== '\n') {
    br = '\n\n'
  }
  return typed.color('yellow') + br + text.slice(size).color('black')
}

// layout: typing area
const typearea = blessed.box({
  top: 'center',
  left: '5%',
  width: '60%',
  height: '100%',
  content: snapshot(),
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: '#f0f0f0'
    }
  }
})

const msgarea = blessed.box({
  top: 'center',
  left: '65%',
  width: '30%',
  height: '100%',
  content: miss.length,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: '#f0f0f0'
    }
  }
})

// 入力イベント処理
typearea.on('keypress', function(ch, e) {
  if (e.name === 'enter') {
    return false
  }
  if (e.name === 'return') {
    ch = '\n'
  }
  let message = 'next type is [' + nextChar() + ']'
  if (pushTyped('' + ch)) {
    typearea.setContent(snapshot())
    message = 'next type is [' + nextChar() + ']'
  } else {
    message += '\nmiss type: ' + miss.length
  }
  msgarea.setContent(message)
  screen.render()
})

screen.append(typearea)
screen.append(msgarea)

// C-cでプログラム終了
screen.key('C-c', function() {
  screen.title = ''
  process.exit(0)
})

// TODO: Enter押したらゲームスタートするように
screen.render()
console.log('clear!')
