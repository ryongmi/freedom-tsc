export function iframeRegex(htmlString) {
  // Use a regular expression to find the oembed element in the HTML string
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatch = htmlString.match(oembedRegex);

  // If an oembed element was found, convert it to an iframe element
  if (oembedMatch) {
    const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];
    const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    htmlString = htmlString.replace(oembedRegex, iframeElement);
  }

  return htmlString;
}
