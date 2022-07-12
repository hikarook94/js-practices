#! /usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const { Select } = require('enquirer')

class MemoCommand {
  constructor () {
    this.memos = JSON.parse(fs.readFileSync('./memos.json', 'utf8'))
  }

  createMemo (input) {
    const _memos = this.memos
    const header = input.split('\n')[0]
    const newMemo = {
      firstLine: header,
      content: input
    }
    _memos.push(newMemo)
    fs.writeFileSync('./memos.json', JSON.stringify(_memos))
  }

  showMemos () {
    this.memos.forEach(memo => {
      console.log(memo.firstLine.trim())
    })
  }

  refMemos () {
    const prompt = new Select({
      type: 'select',
      message: 'Choose a note you want to see:',
      choices: this.getChoices()
    })
    prompt.run()
      .then((answer) => {
        console.log(this.memos.find(memo => memo.firstLine === answer).content)
      })
  }

  deleteMemo () {
    const _memos = this.memos
    const prompt = new Select({
      type: 'select',
      message: 'Choose a note you want to delete:',
      choices: this.getChoices()
    })
    prompt.run()
      .then((answer) => {
        const _deletedMemos = _memos.filter(memo => memo.firstLine !== answer)
        fs.writeFileSync('./memos.json', JSON.stringify(_deletedMemos))
      })
  }

  getChoices () {
    return this.memos.map(memo => ({ name: memo.firstLine }))
  }
}

const memoCommand = new MemoCommand()

if (argv.l) {
  memoCommand.showMemos()
} else if (argv.r) {
  memoCommand.refMemos()
} else if (argv.d) {
  memoCommand.deleteMemo()
} else {
  const input = fs.readFileSync('/dev/stdin', 'utf8')
  memoCommand.createMemo(input)
}
