// DEPRECATED: Use DisplayText instead. This component is kept for backward compatibility.
// All editing should now happen through the centralized EditPanel.

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const EditableText: React.FC<EditableTextProps> = ({
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

export default EditableText;
