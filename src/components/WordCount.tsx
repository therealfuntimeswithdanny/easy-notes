import { Clock, FileText } from 'lucide-react';

interface WordCountProps {
  content: string;
}

export const WordCount = ({ content }: WordCountProps) => {
  const getWordCount = (text: string) => {
    // Remove markdown syntax for accurate word count
    const cleanText = text
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
      .trim();
    
    if (!cleanText) return 0;
    return cleanText.split(/\s+/).length;
  };

  const getReadingTime = (wordCount: number) => {
    // Average reading speed is 200-250 words per minute
    const wordsPerMinute = 225;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const wordCount = getWordCount(content);
  const readingTime = getReadingTime(wordCount);

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span>{wordCount} words</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};