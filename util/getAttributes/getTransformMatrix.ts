export function extractTransformAttribute(svgElement: string): string {
  const transformRegex = /transform="([^"]+)"/;
  const match = svgElement.match(transformRegex);
  if (match && match[1]) {
    return match[1];
  }
  return ""; // Return an empty string if no transform attribute is found
}
