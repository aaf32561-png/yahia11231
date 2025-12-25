
import { ProgrammingLanguage } from '../types';

export const languages: ProgrammingLanguage[] = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: 'bg-blue-500',
    difficulty: 'Beginner',
    useCases: ['Data Science', 'AI', 'Web Dev', 'Automation'],
    description: {
      en: 'High-level, versatile language known for its readability and simple syntax.',
      ar: 'لغة عالية المستوى ومتعددة الاستخدامات، معروفة بسهولة قراءتها وبساطتها.'
    },
    tools: [
      {
        name: 'VS Code',
        platform: 'Desktop',
        url: 'https://code.visualstudio.com/',
        description: { en: 'Most popular editor.', ar: 'المحرر الأكثر شعبية.' }
      },
      {
        name: 'Pydroid 3',
        platform: 'Mobile',
        url: 'https://play.google.com/store/apps/details?id=ru.iiec.pydroid3',
        description: { en: 'Python IDE for Android.', ar: 'بيئة تطوير بايثون للأندرويد.' }
      },
      {
        name: 'Replit',
        platform: 'Web',
        url: 'https://replit.com/',
        description: { en: 'Online coding platform.', ar: 'منصة برمجية سحابية.' }
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    color: 'bg-yellow-400',
    difficulty: 'Beginner',
    useCases: ['Web Front-end', 'Mobile Apps', 'Servers (Node.js)'],
    description: {
      en: 'The language of the web. Essential for interactive websites.',
      ar: 'لغة الويب الأساسية. ضرورية لبناء مواقع تفاعلية.'
    },
    tools: [
      {
        name: 'VS Code',
        platform: 'Desktop',
        url: 'https://code.visualstudio.com/',
        description: { en: 'Best for web dev.', ar: 'الأفضل لتطوير الويب.' }
      },
      {
        name: 'Dcoder',
        platform: 'Mobile',
        url: 'https://play.google.com/store/apps/details?id=com.paprbit.dcoder',
        description: { en: 'Mobile IDE for many languages.', ar: 'تطبيق برمجي للجوال.' }
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '🔵',
    color: 'bg-blue-700',
    difficulty: 'Advanced',
    useCases: ['Game Dev', 'Operating Systems', 'Robotics'],
    description: {
      en: 'Powerful systems programming language used for high-performance applications.',
      ar: 'لغة برمجة أنظمة قوية تستخدم للتطبيقات عالية الأداء مثل الألعاب.'
    },
    tools: [
      {
        name: 'Visual Studio',
        platform: 'Desktop',
        url: 'https://visualstudio.microsoft.com/',
        description: { en: 'Professional IDE.', ar: 'بيئة تطوير احترافية.' }
      },
      {
        name: 'CppDroid',
        platform: 'Mobile',
        url: 'https://play.google.com/store/apps/details?id=com.cppdroid',
        description: { en: 'C++ for Android.', ar: 'تعلم C++ على الأندرويد.' }
      }
    ]
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: '🧡',
    color: 'bg-orange-500',
    difficulty: 'Intermediate',
    useCases: ['iOS Apps', 'macOS Apps'],
    description: {
      en: 'Apple\'s modern language for building apps for iPhone, iPad, and Mac.',
      ar: 'لغة أبل الحديثة لبناء تطبيقات الآيفون والماك.'
    },
    tools: [
      {
        name: 'Xcode',
        platform: 'Desktop',
        url: 'https://developer.apple.com/xcode/',
        description: { en: 'Required for Mac/iOS dev.', ar: 'أساسي لتطوير تطبيقات أبل.' }
      },
      {
        name: 'Swift Playgrounds',
        platform: 'Mobile',
        url: 'https://www.apple.com/swift/playgrounds/',
        description: { en: 'Learn Swift on iPad.', ar: 'تعلم Swift على الآيباد.' }
      }
    ]
  }
];
