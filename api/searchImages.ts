export const config = {
  runtime: "edge", // "nodejs", "python", etc
};

interface I_ImageResponse {
  id: string;
  imageUrl: string;
  imageTitle: string;
}

// Pass an array of image requests and return an array of image results
const searchImage = async (
  id: string,
  query: string
): Promise<I_ImageResponse> => {
  const apiKey = process?.env?.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process?.env?.GOOGLE_SEARCH_ENGINE_ID;
  const imgSize = "medium"; // 'medium', 'icon', 'xxlarge', etc
  const imgType = "photo"; // or 'clipart', 'lineart', etc
  const imgAspectRatio = "square"; // or 'tall', 'square', 'panoramic', etc
  const numResults = 1;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image&imgSize=${imgSize}&imgType=${imgType}&imgAspectRatio=${imgAspectRatio}&num=${numResults}`;
  const res = await fetch(url, {
    method: "GET",
  });

  const result = await res.json();
  const results = result?.items;
  if (results) {
    const resultIndex = 0;
    const item = results[resultIndex];
    const imageUrl = item.link;
    const imageTitle = item.title.replace(/[^a-zA-Z0-9]/g, "_"); // Safe filename
    console.log(`Downloading image ${resultIndex + 1}: ${imageTitle}`);
    return { id, imageUrl, imageTitle };
  } else {
    const msg = "No images found.";
    console.error(msg, res.statusText);
    throw new Error(msg);
  }
};

interface I_ImageRequest {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Free tier limit of 100 queries per day
export const POST = async (req: Request) => {
  try {
    const { requests } = await req.json();

    // Loop through all image requests
    const promises = requests.map(async (req: I_ImageRequest) => {
      const { id, name, description, category } = req;
      const query = `${category} ${name} ${description}`;
      const res = await searchImage(id, query);
      return res;
    });

    const results = await Promise.allSettled(promises);
    const finalResults = results.map((result) => {
      if (result.status === "fulfilled") return result?.value;
      return null;
    });
    return new Response(JSON.stringify({ data: finalResults }));
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: true, message: err, data: {} }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
