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

- Using the "book report", use regex or have a (text-only, faster) model convert to structured json format. We add a globally unique id for menu and all items.

- Take the json and loop through each item and generate an image in sequence (since on free tier). Make sure these images are 1mb (jpg) max at time of upload.

- Before storing the json, we need to store each image in a bucket and get its id back. Put this id into the json like `{imageId: "xxx", imageSource: "https://"}`

- Store the structured json data in a k/v database.

## Task List

- ✅ Image upload functionality

- ✅ Implement Google Gemini JS [SDK](https://github.com/google-gemini/generative-ai-js) or Vercel Ai [SDK](https://sdk.vercel.ai/docs/introduction)

  - [API](https://ai.google.dev/gemini-api/docs/api-overview)
  - [API Key](https://aistudio.google.com/app/u/3/apikey)
  - [Tutorial](https://ai.google.dev/gemini-api/docs/get-started/tutorial)
  - [Rate Limits](https://ai.google.dev/gemini-api/docs/models/gemini)

- ✅ Implement dev input on home page to enter your api key.

- ✅ Store data locally on device (save images/json). Each generation overwrites the previous.

  - Use square 256x256 placeholder image as fallback.

  - Save images as base64 strings to localStorage: https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page

- ✅ Generate images with OpenAI DaLL-E

  - [OpenAi Image Gen](https://platform.openai.com/docs/api-reference/images/create)

  - [OpenAi Rate Limits](https://platform.openai.com/settings/organization/limits)

  - Add another input to enter OpenAI api key.

  - Implement image generation func. Max 1 request/25s.

  - Prevent processing images over limit.

  - Reduce/save image to 256 pixels at 75% compression, square, jpg.

- ✅ Display extra info (ingredients, etc) in tabular ui.

- ✅ Implement translations. Use Gemini 1.0 Pro to translate entire menu into several languages in rolling passes.

  - Fix translation state vars and read-in.

  - Edit menu data schema to accomodate translations

  - Translate app text (category, ingredients, health, allergy, search, print version, website)

  - All menus should use the primary menu's image sources.

  - Translate food types (protein, grain, vegetable, fruit, dairy, food, alcohol beverage, non-alcohol beverage, other)

- ✅ Chat prompt Q&A per menu. Use Google AQA model to perform Attributed Question-Answering tasks over a document.

- ✅ Optional: Set company/menu website to button link. Dont show button if no website listed.

- ❌ Add company details card above sections.

- ❌ Implement react toast for UI messages.

  - Show a loading menu (in center view) after clicking "generate". Hide all other UI and only display progress in toast.

  - Provide a "cancel" button to back out to home page and cancel all outgoing requests.

  - Generate button doesnt have access to file input if its hidden...save value on page level

- ❌ Commit some default menu data (min 3) and provide links in a pulldown button.

  - Probably dont need the search bar if we have a pulldown list

- ❌ Add $ to OpenAI account to use image generation.

- ❌ Make server functions on Vercel to make api requests.

  - Put requests behind a password check.

- ❌ Optional: Do a traditional Google search if no images can be generated and use the top result to display. User must tap the placeholder image to consent to seeing images from the web.

- ❌ Optional: Fix eslint for errors.

- ✅ Optional: Fix the printer friendly functionality.

- ❌ Optional: Convert existing website to Next.js (openbrew website already has similar setup, use app router).

  - Convert all api calls to server-side actions.

  - This allows us to serve api requests publically.

- ❌ Optional: Implement Vercel databases (save images/json on per user basis, user login required)

  - Load menu data from k/v. Load images from bucket using locations from menu data.

- ❌ Optional: Implement firebase for storing/retrieving embeddings? [Gemini RAG](https://ai.google.dev/api/semantic-retrieval/question-answering)

  - When new record is added to real-time storage, update the embeddings as well.
