export const generateQueryKeysFromUrl = (URL: string) => {
  const [pathPart, queryPart] = URL.split('?');
  const pathVariables = pathPart.split('/').filter(Boolean);

  const queryParams = queryPart
    ? queryPart.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        return { ...acc, [key]: value };
      }, {})
    : {};

  return [...pathVariables, ...Object.values(queryParams)];
};
