import * as readline from 'readline'
import { cursor, erase, scroll } from 'sisteransi'
import { bold, green } from 'colorette'

interface AutoComplete {
  message: string
  choices: Choice[]
}

interface Choice {
  title: string
  value?: string
}

const p = (str: string) => process.stdout.write(str) // Echo the key back to the console

const autocompleteData: AutoComplete = {
  message: 'Pick your favorite actor',
  choices: [
    { title: 'Cage' },
    { title: 'Clooney', value: 'silver-fox' },
    { title: 'Gyllenhaal' },
    { title: 'Gibson' },
    { title: 'Grant' },
  ],
}

autocomplete(autocompleteData)

let writing = false

function autocomplete(data: AutoComplete) {
  let userInput: string = '' // Variable to store user input
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    process.stdin.setRawMode(true) // Enable raw mode to capture each keypress
    p(`${bold(green('?'))} ${data.message}: `) // Echo the key back to the console

    process.stdin.on('data', (key: Buffer) => {
      const input = key.toString()
      if (input === '\r' || input === '\n') {
        // Handle Enter keypress
        rl.close() // Close readline interface
        process.stdin.setRawMode(false) // Disable raw mode
      } else {
        if (input === '\u007F') {
          if (userInput.length > 0) {
            userInput = userInput.slice(0, -1)
          }
        } else {
          userInput += input
        }
        const choices = data.choices.filter(({ title }) =>
          fuzzysearch(userInput, title)
        )
        p(erase.line)
        p(cursor.left)
        p(`${bold(green('?'))} ${data.message}: ${userInput}`) // Echo the key back to the console
        p(erase.down())
        writeChoices(choices)
        // p(cursor.move(data.message.length+2, choices.length))
        p(cursor.forward(data.message.length + userInput.length + 4))
        p(cursor.up(choices.length + 1))

        // const asd = data.choices.filter(({ value }) => { console.log(value)})
        // console.log(asd)
        // process.stdout.write(key) // Echo the key back to the console
      }
    })

    // console.log(data.message + " ")
  })
}

function writeChoices(choices: Choice[]) {
  p('\n')
  for (const choice of choices) {
    p(`${choice.title}\n`)
  }
}

function fuzzysearch(needle: string, haystack: string) {
  var hlen = haystack.length
  var nlen = needle.length
  if (nlen > hlen) {
    return false
  }
  if (nlen === hlen) {
    return needle === haystack
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i)
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer
      }
    }
    return false
  }
  return true
}
