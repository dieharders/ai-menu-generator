# Oh!😲Menu - Ai Food Menu Builder

Automatically build accessible food menus from pictures.

Built by OpenBrewAi - https://www.openbrewai.com

## How it works

Snap a pic of a food menu and Ai will turn that into an interactive version complete with images, translations, health info and more. Even talk to the menu as if it were your waiter.

## Features

### Interactive Menu

View the menu digitally as a website or talk to it like a waiter and ask questions about each menu.

### Pics of Food

If no image exists, one will be generated based on the description. Never guess about what you are about to order.

### Translations

Switch the menu to any of several languages.

### Ingredient Breakdown

Lists ingredients in each food item and any associated health risk (allergy) info.

### Data Stored locally

Menu data is stored on-device in LocalStorage.

### Save a Screenshot

Save the menu to your device for later viewing offline.

### Image Generation via OpenAI DaLL-E

- [OpenAI API Key](https://platform.openai.com/api-keys)

- [OpenAi Image Gen](https://platform.openai.com/docs/api-reference/images/create)

- [OpenAi Rate Limits](https://platform.openai.com/settings/organization/limits)

### Text Generation via Google Gemini

- [SDK](https://github.com/google-gemini/generative-ai-js)

- [API](https://ai.google.dev/gemini-api/docs/api-overview)

- [API Key](https://aistudio.google.com/app/u/3/apikey)

- [Tutorial](https://ai.google.dev/gemini-api/docs/get-started/tutorial)

- [Rate Limits](https://ai.google.dev/gemini-api/docs/models/gemini)

## Screenshot Tool using Puppeteer

This script was previously built for other purposes. Kept here for posterity. It is not required for the app to function. This is something you would run offline as a job if you for some reason wanted to bulk screenshot all your menus (maybe a cache server?).

- Run `npm start` to start the app on localhost:3000.

- Run `node puppeteer-screenshot` from the `src/tools` dir.

- This will go through each menu page, open a headless browser and export a screenshot to `src/tools/screenshots`.

## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm test`

### `npm run build`

### `vercel dev`

This will allow you to locally test the api backend for vercel edge functions.

## Deploy to Hosting via Vercel

When pushing to `/main` branch Vercel will automatically deploy website.

## Where to find Webpack config

You can find all webpack config inside `node_modules/react-scripts/config`. Webpack configuration is being handled by react-scripts.
