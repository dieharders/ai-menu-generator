# Technical Info

## App Architecture

- Website that displays each menu. Makes server-side calls to Gemini model using Google Ai Javascript SDK.

- Hosted on `https://ohmenu.openbrewai.com`

- Camera function on website allows user to snap a pic of a menu or upload from camera roll. This image is used to inform the Ai what to build.

- Website uses React and Vercel for hosting.

- API calls are made for inferencing. Then some "glue" operations will be handled locally on device when processing all responses.

## Ai Architecture

Once a menu image is uploaded, we start the build process:

- Use Gemini Pro w/ vision to extract unstructured data and write a book report on everything it saw.

- Using the "book report", use regex or have a (text-only, faster) model convert to structured json format. We add a globally unique id for menu and all items.

- Take the json and loop through each item and generate an image in sequence (since on free tier). Make sure these images are 1mb (jpg) max at time of upload.

- Before storing the json, we need to store each image in a bucket and get its id back. Put this id into the json like `{imageId: "xxx", imageSource: "https://"}`

- Store the structured json data in a k/v database.

## Task List

- ❌ Better photo prompts for image generation.

- ❌ Generate images on demand by clicking on placeholder image?

- ❌ Commit some default menu data (min 3).

- ❌ Optional: Allow multiple images to be uploaded (max 3 total)

- ❌ Optional: Do a traditional Google search if no images can be generated and use the top result to display. User must tap the placeholder image to consent to seeing images from the web.

- ❌ Optional: Convert existing website to Next.js (openbrew website already has similar setup, use app router).

  - Convert all api calls to server-side actions OR use cloud functions without needing to convert website and put requests behind a password check.

  - This allows us to serve api requests publically.

- ❌ Optional: Implement Vercel databases (save images/json on per user basis, user login required)

  - Load menu data from k/v. Load images from Blob Store.
