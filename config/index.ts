import type { AppInfo } from '@/types/app';

export const APP_ID = '5bdaba4a-2628-41af-aca1-54b58db354fe';
export const API_KEY = 'app-3RKw342ftA8oVAdOhjeCb2Vz';
export const API_URL = 'https://api.dify.ai/v1';

export const APP_INFO: AppInfo = {
  title: '雅来康 AI 客服',
  description: '雅来康的智能聊天应用',
  copyright: '© 雅来康科技有限公司',
  privacy_policy: 'https://your-privacy-policy-url', // 如果有隐私政策链接
  default_language: 'zh-Hans', // 默认语言设置为简体中文
};

export const isShowPrompt = false;
export const promptTemplate = 'I want you to act as a javascript console.';

export const API_PREFIX = '/api';

export const LOCALE_COOKIE_NAME = 'locale';

export const DEFAULT_VALUE_MAX_LEN = 48;

