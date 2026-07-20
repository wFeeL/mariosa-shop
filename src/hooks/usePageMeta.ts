import { useEffect } from 'react';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | Mariosa Jewelry`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta && description) meta.content = description;
  }, [description, title]);
}

