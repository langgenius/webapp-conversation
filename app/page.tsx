import type { FC } from 'react'
import React from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'
import  {APP_INFO, isShowPrompt, promptTemplate, APP_ID, API_KEY} from "@/config"

const App: FC<IMainProps> = ({
  params,
}: any) => {
  return (
    <Main params={{
      ...params,
      APP_INFO,
      isShowPrompt,
      promptTemplate,
      APP_ID,
      API_KEY,
    }} />
  )
}

export default React.memo(App)
