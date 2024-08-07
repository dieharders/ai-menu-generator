# Technical Info

## App Architecture

- Website that displays each menu. Makes server-side calls to Gemini model using Google Ai Javascript SDK.

- Hosted on `https://foodsee.openbrewai.com`

- Camera function on website allows user to snap a pic of a menu or upload from camera roll. This image is used to inform the Ai what to build.

- Website uses Next.js and Vercel for hosting

  - Vercel K/V for menu data
  - Vercel Blob Store for menu images (1mb each)

- API calls are made for inferencing. Then some "glue" operations will be handled locally on device when processing all responses.

## Ai Architecture

Once a menu image is uploaded, we start the build process:

- Use Gemini Pro w/ vision to extract unstructured data and write a book report on everything it saw.

  Example output:

  ```markdown
  # Company Name

  (if none exists generate one)

  ## Company Description

  (if none exists generate one)

  ## Food Type

  (american, japanese, greek)

  ## Contact Info

  (if none exists, leave out)

  ## Location Info

  (if none exists, leave out)

  # Section

  (section name)

  ## Item

  (item name)

  ### Description

  (if none exists generate one)

  ### Cost

  (number)

  ### Currency

  (USD, YEN, EUR)

  ### Ingredients

  (if none exists generate one)

  ### Image Description

  (if none exists generate one)

  ### Health Info

  (if none exists generate one)

  ### Allergy Info

  (if none exists generate one)
  ```

- Using the "book report", use regex or have a (text-only, faster) model convert to structured json format. We add a globally unique id for menu and all items.

  Example output:

  ```json
  {
    "menu": {
      "name": "",
      "id": "", // leave blank
      "description": "",
      "type": "",
      "contact": "",
      "location": ""
    },
    "sections": [
      {
        "name": "",
        "items": [
          {
            "name": "",
            "id": "", // leave blank
            "description": "",
            "cost": 0,
            "currency": "",
            "ingredients": "",
            "imageDescription": "",
            "imageId": "", // leave blank
            "imageSource": "", // leave blank
            "health": "",
            "allergy": ""
          }
        ]
      }
    ]
  }
  ```

- Take the json and loop through each item and generate an image in sequence (since on free tier). Make sure these images are 1mb (jpg) max at time of upload.

- Before storing the json, we need to store each image in a bucket and get its id back. Put this id into the json like `{imageId: "xxx", imageSource: "https://"}`

- Store the structured json data in a k/v database.

## Task List

- ✅ Web camera functionality

- ✅ Implement Google Gemini JS [SDK](https://github.com/google-gemini/generative-ai-js) or Vercel Ai [SDK](https://sdk.vercel.ai/docs/introduction)

  - https://ai.google.dev/gemini-api/docs/api-overview
  - https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web

- ❌ Store data locally on device (save images/json). Each generation overwrites the previous.

  - Implement image generation func. Many calls or one? Cap max results (10). How to reduce image to only 256 pixels at 75% compression, ~100kb, square, jpg?

  - Add placeholder image refs into data if menu goes over limit. Create square 256x256 placeholder image.

  - Save images as base64 strings to localStorage: https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page

- ❌ Display extra info (ingredients, etc) in tabular ui.

- ❌ Chat prompt Q&A per menu.

- ❌ Implement translations.

- ❌ Implement dev input on home page to enter your api key. Reset all api keys after testing.

- ❌ Optional: Implement react.toast for UI messages.

  - ❌ Show a loading menu (in center view) after clicking "generate". Hide all other UI and only display progress in toast. Provide a "cancel" button to back out to home page and cancel all outgoing requests.

- ❌ Optional: Display link to any existing data near the search tool on home page. Clicking link takes you to that site.

  - ❌ Commit some default menu data (min 3) and provide a handly link in the list.

- ❌ Optional: Convert existing website to Next.js (openbrew website already has similar setup, use app router).

  - We can publish code w/o server actions or api key. And use a local copy to make the video then commit the finalized next.js code later.

  - ❌ Convert all api calls to server-side actions.

  - This allows us to serve api requests publically.

- ❌ Optional: Implement Vercel databases (save images/json on per user basis, user login required)

  - ❌ Load menu data from k/v. Load images from bucket using locations from menu data.

  - ❌ Extra: Use firebase for storing/retrieving embeddings? [Gemini RAG](https://ai.google.dev/api/semantic-retrieval/question-answering)
    - When new record is added to real-time storage, update the embeddings as well.
