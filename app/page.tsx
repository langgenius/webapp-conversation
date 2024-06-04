'use client';
import React, { FC, useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { IMainProps } from '@/app/components';
import Main from '@/app/components';
import { supabase } from '@/utils/supabaseClient';

const App: FC<IMainProps> = ({ params }: any) => {
  const enableSupabaseAuth = process.env.NEXT_PUBLIC_ENABLE_SUPABASE_AUTH === 'true';
  // Initialize authenticated to true if the feature is disabled
  const [authenticated, setAuthenticated] = useState<boolean>(!enableSupabaseAuth);

  useEffect(() => {
    if (enableSupabaseAuth) {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
      };

      checkSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setAuthenticated(!!session);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [enableSupabaseAuth]);

  return (
    <>
      {authenticated ? (
        <Main params={params} />
      ) : (
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(28 100 242)',
                      brandAccent: 'rgb(28 100 242)'
                    }
                  }
                }
              }}
              providers={[]}
              view="sign_in"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(App);

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties,

  loginCard: {
    maxWidth: '400px',
    width: '100%',
    padding: '2rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: 'white',
  } as React.CSSProperties,
};