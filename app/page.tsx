import type { FC } from 'react'
import React, {useMemo} from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'
import { headers } from 'next/headers'
import  {APP_INFO, isShowPrompt, promptTemplate, APP_ID, API_KEY, SHOW_MOBILE} from "@/config"

const App: FC<IMainProps> = ({
  params,
}: any) => {
  const headerLine = headers();
  const showMobile = useMemo<string|null>(() => {
    if (SHOW_MOBILE) {
      return headerLine.get("user_mobile");
    }
    return null;
  }, [SHOW_MOBILE, headerLine])

  return (
    <Main params={{
      ...params,
      APP_INFO,
      isShowPrompt,
      promptTemplate,
      APP_ID,
      API_KEY,
      showMobile
    }} />
  )
}

export default React.memo(App)
