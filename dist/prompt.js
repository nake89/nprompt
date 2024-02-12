"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nprompt_1 = require("./nprompt");
const autocompleteData = {
    message: 'Pick your favorite actor',
    choices: [
        { title: 'Cage' },
        { title: 'Clooney', value: 'silver-fox' },
        { title: 'Gyllenhaal' },
        { title: 'Gibson' },
        { title: 'Grant' },
    ],
};
(0, nprompt_1.autocomplete)(autocompleteData).then(res => { console.log(res); });
