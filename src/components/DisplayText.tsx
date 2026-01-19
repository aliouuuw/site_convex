import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface DisplayTextProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const DisplayText: React.FC<DisplayTextProps> = ({
  id,
  children,
  className = '',
  as: Component = 'span',
}) => {
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });

  const looksLikeHtml = Boolean(content?.content && /<[^>]+>/.test(content.content));

  if (content?.type === 'richText' || looksLikeHtml) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: content?.content || '' }}
      />
    );
  }

  if (content?.content) {
    return <Component className={className}>{content.content}</Component>;
  }

  return <Component className={className}>{children}</Component>;
};

export default DisplayText;
