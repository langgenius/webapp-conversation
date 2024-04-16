'use client'
import type { FC } from 'react'
import React, {useMemo, useState} from "react";
import AppIcon from '@/app/components/base/app-icon'
import { FormEvent } from 'react'
import {auth} from "@/service"

import "./auth.scss"

const App: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setError] = useState<string>('');
  const showError = useMemo<boolean>(():boolean => {
    return !!(errorMsg && errorMsg.length > 0);
  }, [errorMsg]);
  const hasError = useMemo<string>(() => {
    return showError ? 'input_box has-error' : 'input_box';
  }, [showError]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true);

    const formData = new FormData(event.currentTarget)
    const mobile = formData.get("mobile") || '';
    try {
      const data = await auth(`${mobile}`);
      if (data?.status && (typeof location != "undefined")) {
        location.href = "/";
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }

    setLoading(false);
  }

    return (
    <div className='w-screen h-screen bg-black bg-opacity-30 fixed top-0 right-0 flex justify-center items-center auth-mask'>
      <div className="login_box">
          <div className="login_top clearfix"><AppIcon
            size='small'
          /><span className="font-frutiger">ZoEasy</span></div>
          <div className="login_conter">
            <form onSubmit={onSubmit}>
              <fieldset disabled={loading}>
                <p className="conter_title">請輸入你已在<br />蘇黎世登記的手提電話號碼:</p>
                <div className={hasError}>
                  <input maxLength="8" name="mobile" type="text" />
                  { showError ? <p className="error">{errorMsg}</p> : null }
                </div>
                <button className="conter_submit" type="submit">遞交</button>
              </fieldset>
            </form>
          </div>
      </div>
    </div>
  )
}

export default React.memo(App)
