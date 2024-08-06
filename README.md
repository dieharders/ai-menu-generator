# FoodSee (Omenu) - An Ai Food Menu Builder

Automatically build accessible food menus for everyone.

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

## Screenshot Tool using Puppeteer

This script will create an image or "printable" version of the menu that can be used to embed online or store locally for later viewing without internet connection.

Run `npm start` to start the app on localhost:3000.

Run `node puppeteer-screenshot` from the `src/tools` dir.

This will go through each menu page, open a headless browser and export a screenshot to `src/tools/screenshots`.

## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm test`

### `npm run build`

## Deploy to Hosting via Vercel

When pushing to `/main` branch Vercel will automatically deploy website.

## Where to find Webpack config

You can find all webpack config inside `node_modules/react-scripts/config`. Webpack configuration is being handled by react-scripts.
