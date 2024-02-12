"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocomplete = void 0;
const readline = __importStar(require("readline"));
const sisteransi_1 = require("sisteransi");
const colorette_1 = require("colorette");
const p = (str) => process.stdout.write(str); // Echo the key back to the console
function autocomplete(data) {
    let writing = false;
    let selectedIndex = 0;
    let choices = [];
    let userInput = ''; // Variable to store user input
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        process.stdin.setRawMode(true); // Enable raw mode to capture each keypress
        p(`${(0, colorette_1.bold)((0, colorette_1.green)('?'))} ${data.message}: `); // Echo the key back to the console
        process.stdin.on('data', (key) => {
            const input = key.toString();
            // Handle Enter keypress
            if (input === '\r' || input === '\n') {
                // Empty selection
                p(sisteransi_1.cursor.up());
                p(sisteransi_1.erase.down());
                rl.close(); // Close readline interface
                process.stdin.setRawMode(false); // Disable raw mode
                resolve(choices[selectedIndex]);
            }
            else {
                // Backspace
                if (input === '\u007F') {
                    if (userInput.length > 0) {
                        userInput = userInput.slice(0, -1);
                    }
                    // If input not arrow keys add key input to user input
                }
                else if (input !== '\u001b[A' && input !== '\u001b[B') {
                    userInput += input;
                }
                choices = data.choices.filter(({ title }) => fuzzysearch(userInput, title));
                // Handle arrow keys
                if (input == '\u001b[A') {
                    if (selectedIndex !== 0)
                        selectedIndex--;
                }
                else if (input == '\u001b[B') {
                    if (selectedIndex < choices.length - 1)
                        selectedIndex++;
                }
                p(sisteransi_1.erase.line);
                p(sisteransi_1.cursor.left);
                p(`${(0, colorette_1.bold)((0, colorette_1.green)('?'))} ${data.message}: ${userInput}`);
                p(sisteransi_1.erase.down());
                writeChoices(choices, selectedIndex);
                p(sisteransi_1.cursor.forward(data.message.length + userInput.length + 4));
                p(sisteransi_1.cursor.up(choices.length + 1));
            }
        });
    });
}
exports.autocomplete = autocomplete;
function writeChoices(choices, selectedIndex) {
    p('\n');
    for (const [i, choice] of choices.entries()) {
        if (i === selectedIndex) {
            p(`${(0, colorette_1.green)('❯ ' + (0, colorette_1.underline)(choice.title))}\n`);
        }
        else {
            p(`${choice.title}\n`);
        }
    }
}
function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}
