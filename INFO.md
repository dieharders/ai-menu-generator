# Technical Info

## App Architecture

- Website that displays each menu. Makes server-side calls to Gemini model using Google Ai Javascript SDK.

- Hosted on `https://foodieee.openbrewai.com`

- Camera function on website allows user to snap a pic of a menu or upload from camera roll. This image is used to inform the Ai what to build.

- Website uses Next.js and Vercel for hosting
- - Vercel K/V for menu data
- - Vercel Blob Store for menu images (1mb each)

## Ai Architecture

Once an image is uploaded, we start the build process:

- Use Gemini vision to pull out unstructured menu data and write a book report on everything it saw in the menu. This "report" will be passed onto a reasoning (text-only, faster) model for processing.

- Using the "book report", convert to a structured json format.

- The structured data is stored in a database.

- When a new item is added to the database, go through each item in the menu's array and make a call to Gemini to fill in any missing data (image, descr, etc). We will need to work around the 15 calls/min rule, maybe with Cron Jobs?

## Task List

- ❌ Web camera functionality

- ❌ Implement Google Gemini JS [SDK](https://github.com/google-gemini/generative-ai-js) or Vercel Ai [SDK](https://sdk.vercel.ai/docs/introduction)

- ❌ Convert existing website to Next.js

- ❌ Implement Vercel databases (images and json)

- ❌ Create server-side actions for Ai menu creation
