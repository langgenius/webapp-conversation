import React from 'react'


type PlusIconProps = {
    className: string
}
const PlusIcon: React.FC<PlusIconProps> = ({ className }) => {

    return <svg xmlns="http://www.w3.org/2000/svg" className={className} width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1V9" stroke="white" stroke-width="1.14286" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M1 5H9" stroke="white" stroke-width="1.14286" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
}

export default PlusIcon