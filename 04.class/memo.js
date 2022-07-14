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
    const firstLine = input.split('\n')[0]
    const newMemo = {
      header: firstLine,
      content: input
    }
    _memos.push(newMemo)
    this.#writeFile(_memos)
  }

  showMemos () {
    this.memos.forEach(memo => {
      console.log(memo.header.trim())
    })
  }

  refMemos () {
    const message = 'Choose a note you want to see:'
    const prompt = this.#getSelectPrompt(message)
    prompt.run()
      .then((answer) => {
        console.log(this.memos.find(memo => memo.header === answer).content)
      })
  }

  deleteMemo () {
    const _memos = this.memos
    const message = 'Choose a note you want to delete:'
    const prompt = this.#getSelectPrompt(message)
    prompt.run()
      .then((answer) => {
        const _deletedMemos = _memos.filter(memo => memo.header !== answer)
        this.#writeFile(_deletedMemos)
      })
  }

  canSelect () {
    return this.memos.length > 0
  }

  #getChoices () {
    return this.memos.map(memo => ({ name: memo.header }))
  }

  #writeFile (memos) {
    fs.writeFileSync('./memos.json', JSON.stringify(memos))
  }

  #getSelectPrompt (message) {
    return new Select({
      type: 'select',
      choices: this.#getChoices(),
      message
    })
  }
}

function main () {
  const memoCommand = new MemoCommand()
  if (argv.l) {
    memoCommand.showMemos()
  } else if (argv.r) {
    if (memoCommand.canSelect()) {
      memoCommand.refMemos()
    }
  } else if (argv.d) {
    if (memoCommand.canSelect()) {
      memoCommand.deleteMemo()
    }
  } else {
    const input = fs.readFileSync('/dev/stdin', 'utf8')
    memoCommand.createMemo(input)
  }
}

main()
