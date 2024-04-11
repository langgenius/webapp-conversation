import type { FC } from 'react'
import classNames from 'classnames'
import style from './style.module.css'
import LogoImage from "./logo.svg";
import Image from "next/image";

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
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
    >
      <Image src={LogoImage} alt="logo" />
    </span>
  )
}

export default AppIcon
