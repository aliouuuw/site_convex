import React, { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface ContentContextType {
  content: Map<string, string>;
  get: (key: string,
    defaultValue: string
  ) => string;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType>({
  content: new Map(),
  get: (_key: string, defaultValue: string) => defaultValue,
  isLoading: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => {
  return useContext(ContentContext);
};

interface ContentProviderProps {
  children: React.ReactNode;
}

export default function ContentProvider({ children }: ContentProviderProps) {
  const allContent = useQuery(api.content.getAllContent, {});

  const contentMap = new Map<string, string>();
  if (allContent) {
    for (const { id, content } of allContent) {
      contentMap.set(id, content);
    }
  }

  const contentContextValue: ContentContextType = {
    content: contentMap,
    get: (key: string, defaultValue: string) => {
      return contentMap.get(key) || defaultValue;
    },
    isLoading: allContent === undefined,
  };

  return (
    <ContentContext.Provider value={contentContextValue}>
      {children}
    </ContentContext.Provider>
  );
}