import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ContentRenderer from './ContentRenderer';

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

  return (
    <ContentRenderer
      content={content?.content}
      type={content?.type}
      fallback={children}
      className={className}
      as={Component}
    />
  );
};

export default DisplayText;
