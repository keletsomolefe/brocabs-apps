import { Colors } from "@brocabs/ui/theme/colors";
import React from "react";
import { Linking, Text, type TextStyle } from "react-native";

/**
 * Simple HTML Text Renderer
 *
 * Renders basic HTML/markdown formatting in React Native Text components.
 * Supports:
 * - **bold** or <b>bold</b> or <strong>bold</strong>
 * - <u>underline</u>
 * - [link text](url) or <a href="url">link text</a>
 * - Paragraph breaks (double newline)
 */

interface RichTextProps {
  /** The text content with HTML/markdown formatting */
  children: string;
  /** Base text style */
  style?: TextStyle;
  /** Color key from theme */
  color?: keyof typeof Colors;
  /** Font size */
  fontSize?: number;
  /** Line height */
  lineHeight?: number;
}

interface TextSegment {
  text: string;
  bold?: boolean;
  underline?: boolean;
  link?: string;
}

/**
 * Parse text with basic HTML/markdown formatting into segments
 */
function parseFormattedText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  // Create a single regex that matches all patterns
  const combinedPattern =
    /\[([^\]]+)\]\(([^)]+)\)|<a\s+href=["']([^"']+)["']>([^<]+)<\/a>|\*\*([^*]+)\*\*|<b>([^<]+)<\/b>|<strong>([^<]+)<\/strong>|<u>([^<]+)<\/u>/gi;

  let match;
  while ((match = combinedPattern.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      if (plainText) {
        segments.push({ text: plainText });
      }
    }

    // Determine which pattern matched
    if (match[1] && match[2]) {
      // Markdown link: [text](url)
      segments.push({ text: match[1], link: match[2] });
    } else if (match[3] && match[4]) {
      // HTML link: <a href="url">text</a>
      segments.push({ text: match[4], link: match[3] });
    } else if (match[5]) {
      // Markdown bold: **text**
      segments.push({ text: match[5], bold: true });
    } else if (match[6]) {
      // HTML bold: <b>text</b>
      segments.push({ text: match[6], bold: true });
    } else if (match[7]) {
      // HTML strong: <strong>text</strong>
      segments.push({ text: match[7], bold: true });
    } else if (match[8]) {
      // HTML underline: <u>text</u>
      segments.push({ text: match[8], underline: true });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

/**
 * Handle link press - opens URL in browser
 */
function handleLinkPress(url: string) {
  Linking.openURL(url).catch((err) => {
    console.warn("Failed to open URL:", url, err);
  });
}

/**
 * RichText Component
 *
 * Renders text with basic formatting support.
 */
export function RichText({
  children,
  style,
  color = "Neutrals/400",
  fontSize = 14,
  lineHeight = 24,
}: RichTextProps) {
  const segments = parseFormattedText(children);

  const baseStyle: TextStyle = {
    fontSize,
    lineHeight,
    color: Colors[color],
    fontFamily: "BRHendrix-Regular",
    ...style,
  };

  return (
    <Text style={baseStyle}>
      {segments.map((segment, index) => {
        const segmentStyle: TextStyle = {};

        if (segment.bold) {
          segmentStyle.fontFamily = "BRHendrix-SemiBold";
          segmentStyle.fontWeight = "600";
        }

        if (segment.underline) {
          segmentStyle.textDecorationLine = "underline";
        }

        if (segment.link) {
          segmentStyle.color = Colors["Primary/600"];
          segmentStyle.textDecorationLine = "underline";

          return (
            <Text
              key={index}
              style={[baseStyle, segmentStyle]}
              onPress={() => handleLinkPress(segment.link!)}>
              {segment.text}
            </Text>
          );
        }

        if (segment.bold || segment.underline) {
          return (
            <Text key={index} style={segmentStyle}>
              {segment.text}
            </Text>
          );
        }

        return segment.text;
      })}
    </Text>
  );
}

export default RichText;
