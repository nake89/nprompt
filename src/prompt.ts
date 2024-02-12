import {autocomplete, AutoComplete, Choice} from "./nprompt"

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

autocomplete(autocompleteData).then(res => {console.log(res)})
