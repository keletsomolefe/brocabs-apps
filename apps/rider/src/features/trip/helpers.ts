export function getMatchedSegments(
  text: string,
  matches: google.maps.places.StringRange[]
): FormattedText[] {
  if (!matches?.length) return [{ text, bold: false }];

  const segments: FormattedText[] = [];
  let lastIndex = 0;

  matches.forEach(({ startOffset, endOffset }) => {
    if (startOffset > lastIndex)
      segments.push({ text: text.slice(lastIndex, startOffset), bold: false });
    segments.push({ text: text.slice(startOffset, endOffset), bold: true });
    lastIndex = endOffset;
  });

  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), bold: false });

  return segments;
}

export interface FormattedText {
  text: string;
  bold: boolean;
}
