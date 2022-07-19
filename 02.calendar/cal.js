#! /usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))

const WEEK = 7
const WEEK_LABEL = ['日', '月', '火', '水', '木', '金', '土']

const year = argv.y || new Date().getFullYear()
const month = argv.m || new Date().getMonth() + 1
const startDate = new Date(year, month - 1, 1)
const endDate = new Date(year, month, 0)

const dates = [...Array(endDate.getDate())].map((_, i) => String(i + 1).padStart(2, ' '))
const spaces = [...Array(startDate.getDay())].map(_ => '  ')
const spaceStartedDates = spaces.concat(dates)

const spaceStartedDatesByWeek = []
for (let i = 0; i < spaceStartedDates.length; i += WEEK) {
  spaceStartedDatesByWeek.push(spaceStartedDates.slice(i, i + WEEK))
}

console.log(`      ${startDate.getMonth() + 1}月 ${startDate.getFullYear()}`)
console.log(WEEK_LABEL.join(' '))
spaceStartedDatesByWeek.forEach((date, i) => {
  console.log(date.join(' '))
})
