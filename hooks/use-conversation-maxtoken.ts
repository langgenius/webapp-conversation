import {useEffect, useState} from 'react';
import useStore from "./use-store"

const MAX_TOKEN_STORE_NAME = 'MAX_TOKEN_CONVERSATIONS'

function useConversationMaxToken() {
    const [maxTokenStore, setMaxTokenStore] = useStore<string[]>(MAX_TOKEN_STORE_NAME, []);
    const [isMaxToken, setIsMaxToken] = useState<boolean>(false);
    const [currID, setCurrID] = useState<string>('');
    // 返回判定函数
    const addConversation = (conversation_id: string) => {
        if (maxTokenStore.includes(conversation_id)) {
            return false;
        }
        maxTokenStore.push(conversation_id);
        setMaxTokenStore(Array.from(maxTokenStore.values()));
    };

    const setConversation = (conversation_id: string) => {
        setCurrID(conversation_id);
    }

    useEffect(() => {
        setIsMaxToken(maxTokenStore.includes(currID));
    }, [maxTokenStore, currID])


    return [isMaxToken, setConversation, addConversation] as const;
}

export default useConversationMaxToken
