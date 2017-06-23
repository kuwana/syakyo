// process.stdin.setRawMode(true)
// process.stdin.resume()
// process.stdin.on('data', function (chunk) {
//   process.stdout.write('data: ' + chunk)
// })

const blessed = require('blessed');

const screen = blessed.screen({
  smartCSR: true
})

screen.title = 'test'

const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '100%',
  content: 'Hello {bold}world{/bold}!',
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
});

box.on('keypress', function(ch, all) {
  box.setContent(ch + ' pressed')
  screen.render()
})

screen.append(box)

screen.render()
