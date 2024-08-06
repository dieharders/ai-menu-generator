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

- ❌ Implement Vercel databases (images and json)

- ❌ Load menu data from k/v. Load images from bucket using locations from menu data.

- ❌ Convert existing website to Next.js (openbrew website already has similar setup, use app router). Reset all api keys after testing.

- ❌ Create server-side actions for Ai menu creation.

- ❌ Extra: Use firebase for storing/retrieving embeddings? [Gemini RAG](https://ai.google.dev/api/semantic-retrieval/question-answering)
