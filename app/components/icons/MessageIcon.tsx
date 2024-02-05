import React from 'react';

type MessageIconProps = {
    className: string
}
const MessageIcon: React.FC<MessageIconProps> = ({ className }) => {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
                d="M13 9C13 9.35362 12.8595 9.69276 12.6095 9.94281C12.3594 10.1929 12.0203 10.3333 11.6667 10.3333H3.66667L1 13V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H11.6667C12.0203 1 12.3594 1.14048 12.6095 1.39052C12.8595 1.64057 13 1.97971 13 2.33333V9Z"
                stroke="#C5C5D1"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default MessageIcon;