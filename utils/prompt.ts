import { PromptVariable, UserInputFormItem } from '@/types/app'

export function replaceVarWithValues(str: string, promptVariables: PromptVariable[], inputs: Record<string, any>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const name = inputs[key]
    if (name)
      return name

    const valueObj: PromptVariable | undefined = promptVariables.find(v => v.key === key)
    return valueObj ? `{{${valueObj.key}}}` : match
  })
}

export const userInputsFormToPromptVariables = (useInputs: UserInputFormItem[] | null) => {
  if (!useInputs) return []
  const promptVariables: PromptVariable[] = []
  useInputs.forEach((item: any) => {
    const type = item['text-input'] ? 'string' : 'select'
    const content = type === 'string' ? item['text-input'] : item['select']
    if (type === 'string') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type: 'string',
        max_length: content.max_length,
        options: [],
      })
    } else {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type: 'select',
        options: content.options,
      })
    }
  })
  return promptVariables
}