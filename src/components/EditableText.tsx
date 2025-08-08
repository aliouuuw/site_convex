import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEditMode } from '../hooks/useEditMode';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  page?: string;
  as?: React.ElementType;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  children,
  className = '',
  page = 'home',
  as: Component = 'span',
}) => {
  const { isEditMode } = useEditMode();
  
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  
  // Use content from database if available, otherwise fallback to children
  const currentContent = content?.content || (typeof children === 'string' ? children : '');

  return (
    <Component
      className={`${className} ${isEditMode ? 'live-edit-element' : ''}`}
      data-live-edit-id={id}
      data-live-edit-type="text"
      data-live-edit-page={page}
    >
      {currentContent}
    </Component>
  );
};

export default EditableText;
