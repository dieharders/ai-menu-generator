interface I_ImageResponse {
  imageUrl: string;
  imageTitle: string;
}

export const searchImagesAction = async (
  requests: any[]
): Promise<I_ImageResponse[] | undefined> => {
  try {
    const fetchResponse = await fetch(
      `${location.protocol}//${location.host}/api/searchImages`,
      {
        method: "POST",
        body: JSON.stringify({
          requests,
        }),
      }
    );
    if (!fetchResponse.ok) throw new Error(fetchResponse?.statusText);
    const res = await fetchResponse?.json();
    if (res?.error) throw new Error(res?.message);
    return res?.data;
  } catch (err) {
    console.error(`${err}`);
  }
};

/**
 * Fetch some default image(s) from google for a given item.
 * Returns a url string that points to image on another server.
 */
export const requestImageSearch = async (item: any) => {
  const source = item?.imageSource;
  if (source) throw new Error("Item already has image.");

  const req = {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
  };
  const response = await searchImagesAction([req]);
  const result = response?.[0];

  if (result) return result.imageUrl;

  return { error: true, message: "Trouble searching google images." };
};
