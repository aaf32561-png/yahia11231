
export type AppLanguage = 'ar' | 'en';

export interface Tool {
  name: string;
  platform: 'Mobile' | 'Desktop' | 'Web';
  url: string;
  description: {
    en: string;
    ar: string;
  };
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  icon: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  useCases: string[];
  description: {
    en: string;
    ar: string;
  };
  tools: Tool[];
  helloWorld?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ProjectRoadmap {
  title: string;
  difficulty: string;
  languages: string[];
  steps: {
    title: string;
    description: string;
  }[];
}
