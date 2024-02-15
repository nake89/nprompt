import * as readline from 'readline'
import { cursor, erase, scroll } from 'sisteransi'
import { bold, green, underline } from 'colorette'

export interface AutoComplete {
  message: string
  choices: Choice[]
}

export interface Choice {
  title: string
  value?: string
}

const p = (str: string) => process.stdout.write(str) // Echo the key back to the console


export function autocomplete(data: AutoComplete) {
  let writing = false
  let selectedIndex = 0
  let choices: Choice[] = []
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
        // Handle Enter keypress
      if (input === '\r' || input === '\n') {
        // Empty selection
        p(cursor.up())
        p(erase.down())
        rl.close() // Close readline interface
        process.stdin.setRawMode(false) // Disable raw mode
        resolve(choices[selectedIndex])
      } else {
        // Backspace
        if (input === '\u007F') {
          if (userInput.length > 0) {
            userInput = userInput.slice(0, -1)
          }
          // If input not arrow keys add key input to user input
        } else if (input !== '\u001b[A' && input !== '\u001b[B') {
          userInput += input
        }
        choices = data.choices.filter(({ title }) =>
          fuzzysearch(userInput, title)
        )

        // Handle arrow keys
        if (input == '\u001b[A') {
          if (selectedIndex !== 0) selectedIndex--
        } else if (input == '\u001b[B') {
          if (selectedIndex < choices.length - 1) selectedIndex++
        }
        p(erase.line)
        p(cursor.left)
        p(`${bold(green('?'))} ${data.message}: ${userInput}`)
        p(erase.down())
        writeChoices(choices, selectedIndex)
        p(cursor.forward(data.message.length + userInput.length + 4))
        p(cursor.up(choices.length + 1))
      }
    })
  })
}

function writeChoices(choices: Choice[], selectedIndex:number) {
  p('\n')
  for (const [i, choice] of choices.entries()) {
    if (i === selectedIndex) {
      p(`${green('❯ ' + underline(choice.title))}\n`)
    } else {
      p(`${choice.title}\n`)
    }
  }
}

function fuzzysearch(needle: string, haystack: string) {
  needle = needle.toLowerCase()
  haystack = haystack.toLowerCase()

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
