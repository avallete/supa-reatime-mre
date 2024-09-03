import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from "./supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";


function LoginView() {
	return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
    />
	);
};

function UserInfos() {
  const [user, setUser] = useState<{email: string} | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then((value) => {
      if (value.data.session?.user) {
        setUser({email: value.data.session?.user.email ?? '??' })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({email: session.user.email ?? '??' })
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    const messagesChannel = supabase.channel('channel1');

    function messageReceived(payload: unknown) {
      console.log(`User with email: ${user?.email} received payload:`, payload)
    }

    messagesChannel
      .on('broadcast', { event: 'new_message' }, (payload) => messageReceived(payload.payload))
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [user]);

  function onSubmit() {
    supabase.channel('channel1').send({
      type: 'broadcast',
      event: 'new_message',
      payload: {
        user: user?.email,
        sent_at: Date.now(),
      }
    })
  }


  if (user) {
    return (
      <div>
        <p>Authenticated with: {user.email}</p>
        <button onClick={onSubmit}>BroadcastMessage</button>
      </div>
    )
  }
  return (
    <div>
      <p>Unauthenticated</p>
      <button onClick={onSubmit}>BroadcastMessage</button>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserInfos />
      <LoginView />
    </>
  )
}

export default App
