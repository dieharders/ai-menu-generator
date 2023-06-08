This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Where to find Webpack config

You can find all webpack config inside `node_modules/react-scripts/config`. Webpack configuration is being handled by react-scripts.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Deploy to Hosting via Vercel

When pushing to `/main` branch Vercel will automatically deploy website.

### Screenshot Tool using Puppeteer

Run `npm start` to start the app on localhost:3000.
Run `node puppeteer-screenshot` from the `src/tools` dir.
This will go through each company, open a headless browser and export a screenshot to `src/tools/screenshots`.

### Made with:

Restaurant Menu Layout: [react-restaurant-menu](https://codesandbox.io/s/react-restaurant-menu-i4d3o)
