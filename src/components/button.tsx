import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Roboto } from '../app/fonts'

interface ButtonProps {
  text: string
  link: string
  icon: any // Adjust this type according to your FontAwesome icon imports
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  textColor?: string // Optional prop for overriding the text color
  type?: 'default' | 'animatedIconHover' | 'animatedHover' // New prop
}

const sizeStyles = {
  xs: {
    padding: 'py-[4px] px-[10px]',
    text: 'text-xs',
    maxWidth: 'max-w-[95px]',
    iconMargin: 'ml-1',
    chevronTranslate: 'group-hover:translate-x-[5px]',
    sideBarWidth: 'w-[20px]',
  },
  sm: {
    padding: 'py-[5px] px-[15px]',
    text: 'text-sm',
    maxWidth: 'max-w-[120px]',
    iconMargin: 'ml-2',
    chevronTranslate: 'group-hover:translate-x-[6px]',
    sideBarWidth: 'w-[25px]',
  },
  base: {
    padding: 'py-[6px] px-[20px]',
    text: 'text-base',
    maxWidth: 'max-w-[133px]',
    iconMargin: 'ml-2',
    chevronTranslate: 'group-hover:translate-x-[8px]',
    sideBarWidth: 'w-[30px]',
  },
  md: {
    padding: 'py-[7px] px-[20px]',
    text: 'text-[14px]',
    maxWidth: 'w-[138px]',
    iconMargin: 'ml-3',
    chevronTranslate: 'group-hover:translate-x-[10px]',
    sideBarWidth: 'w-[35px]',
  },
  lg: {
    padding: 'py-[8px] px-[30px]',
    text: 'text-lg',
    maxWidth: 'max-w-[170px]',
    iconMargin: 'ml-3',
    chevronTranslate: 'group-hover:translate-x-[11px]',
    sideBarWidth: 'w-[40px]',
  },
  xl: {
    padding: 'py-[10px] px-[30px]',
    text: 'text-xl',
    maxWidth: 'max-w-[185px]',
    iconMargin: 'ml-3',
    chevronTranslate: 'group-hover:translate-x-[12px]',
    sideBarWidth: 'w-[45px]',
  },
  '2xl': {
    padding: 'py-[12px] px-[35px]',
    text: 'text-2xl',
    maxWidth: 'max-w-[200px]',
    iconMargin: 'ml-4',
    chevronTranslate: 'group-hover:translate-x-[12px]',
    sideBarWidth: 'w-[50px]',
  },
}

const CustomButton: React.FC<ButtonProps> = ({
  text,
  link,
  icon,
  size = 'md',
  textColor = '#777777',
  type = 'default', // Default value for buttonType
}) => {
  const {
    padding,
    text: textSize,
    maxWidth,
    iconMargin,
    chevronTranslate,
    sideBarWidth,
  } = sizeStyles[size]

  if (type === 'animatedIconHover') {
    return (
      <a
        href={link}
        className={`group relative inline-flex items-center ${maxWidth} min-w-0 ${padding} ${textSize} leading-[1.4666666667] rounded-[3px] transition-all duration-200 ease-in-out font-normal text-center whitespace-nowrap align-middle cursor-pointer select-none bg-transparent border border-[#09afdf] hover:text-white text-[${textColor}] hover:bg-[#0c9ec7]`}
      >
        <span className="z-10">{text}</span>
        <FontAwesomeIcon
          icon={icon}
          className={`z-10 transform transition-transform duration-300 ease-in-out ${iconMargin} ${chevronTranslate}`}
        />
        <span
          className={`absolute top-0 right-0 ${sideBarWidth} h-full bg-[#0b8eb3] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 rounded-r-[3px] pointer-events-none z-0`}
        ></span>
      </a>
    )
  }

  if (type === 'animatedHover') {
    return (
      <a
        href={link}
        className={`${Roboto.className} text-white border border-[#0c9ec7] px-4 py-1 text-xs leading-[1.4666666667] rounded-[3px] my-0 mt-0 mb-0 font-normal text-center whitespace-nowrap touch-manipulation cursor-pointer select-none hover:text-white btn-hvr hvr-shutter-out-horizontal margin-clear !bg-[#09afdf] shadow-lg`}
      >
        {text}
        <FontAwesomeIcon
          icon={icon}
          className={`z-10 transform transition-transform duration-300 ease-in-out ml-2`}
        />
      </a>
    )
  }

  // Default button
  return (
    <a
      href={link}
      className={`inline-flex items-center justify-center ${padding} ${textSize} ${maxWidth} text-[${textColor}] bg-[#09afdf] border border-[#0c9ec7] rounded-[3px] hover:bg-[#0c9ec7] hover:text-white transition-all duration-200 ease-in-out`}
    >
      {text}
    </a>
  )
}

export default CustomButton
