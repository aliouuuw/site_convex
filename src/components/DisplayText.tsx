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
  
  // Use content from database if available, otherwise fallback to children
  const currentContent = content?.content || (typeof children === 'string' ? children : '');

  return (
    <Component className={className}>
      {currentContent}
    </Component>
  );
};

export default DisplayText;
