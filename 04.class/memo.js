#! /usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const { Select } = require('enquirer')

// console.log(argv)

class MemoCommand {
  constructor () {
    this.memos = JSON.parse(fs.readFileSync('./memos.json', 'utf8'))
  }

  createMemo (input) {
    const header = input.split('\n')[0]
    const newMemo = {
      firstLine: header,
      content: input
    }
    this.memos.push(newMemo)
    fs.writeFileSync('./memos.json', JSON.stringify(this.memos))
  }

  showMemos () {
    this.memos.forEach(memo => {
      console.log(memo.firstLine.trim())
    })
  }

  refMemos () {
    console.log(this.getChoices())
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
    // console.log('deleteMemos')
  }

  getChoices () {
    return this.memos.map((memo, index) => {
      return { name: memo.firstLine }
    })
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
