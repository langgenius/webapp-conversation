'use client'
import { useState, useEffect } from 'react';

// 自定义 useStore 钩子
function useStore<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        // 从 localStorage 中读取初始值
        let storedValue = null;
        if (typeof localStorage !== "undefined") {
            storedValue = localStorage.getItem(key);
        }
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    // 监听状态变化，更新 localStorage
    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [state, key]);

    return [state, setState] as const;
}

export default useStore
