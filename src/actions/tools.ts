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
