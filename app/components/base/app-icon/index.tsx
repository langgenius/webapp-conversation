import type { FC } from 'react'
import classNames from 'classnames'
import style from './style.module.css'

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="17" viewBox="0 0 19 17" fill="none">
      <path d="M13.1237 4.29838L4.57116 13.1548C2.12529 10.7929 2.05725 6.89547 4.41921 4.44959C6.78117 2.00371 10.6778 1.93642 13.1237 4.29838Z" fill="#ECB22D" />
      <path d="M5.87695 12.7017L14.4295 3.84524C16.8754 6.20719 16.9434 10.1046 14.5815 12.5504C12.2195 14.9949 8.32209 15.0629 5.87695 12.7017Z" fill="#101A3C" />
    </svg>
  )
}

export default AppIcon
