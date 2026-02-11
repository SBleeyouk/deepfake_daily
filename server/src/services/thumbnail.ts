import ogs from 'open-graph-scraper';

export async function extractThumbnail(url: string): Promise<string | null> {
  try {
    const { result } = await ogs({ url });
    if (result.ogImage && result.ogImage.length > 0) {
      return result.ogImage[0].url;
    }
    return null;
  } catch (error) {
    console.error('Thumbnail extraction failed:', error);
    return null;
  }
}
