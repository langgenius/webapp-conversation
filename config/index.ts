export const APP_ID = ''
export const API_KEY = ''
export const APP_INFO = {
  "app_id": APP_ID,
  "site": {
    "title": "Chat APP",
    "description": null,
    "copyright": null,
    "privacy_policy": null,
    "default_language": "zh-Hans",
    "prompt_public": true
  },
  "prompt_config": {
    "introduction": "Chat APP",
    "prompt_template": "{{a}}", "prompt_variables": [{ "key": "a", "name": "a", "type": "string", "max_length": 48 }], "completion_params": { "max_token": 256, "temperature": 1, "top_p": 1, "presence_penalty": 0, "frequency_penalty": 0 }
  }
}



export const API_PREFIX = '/api';

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
