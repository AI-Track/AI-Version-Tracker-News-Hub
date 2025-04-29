import { useStore } from '@/store';
import { translations } from '@/i18n/translations';

type NestedObject = {
  [key: string]: string | NestedObject;
};

type TranslationType = typeof translations.en;

export const useTranslation = () => {
  const { language } = useStore();

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value as string;
  };

  return { t };
}; 