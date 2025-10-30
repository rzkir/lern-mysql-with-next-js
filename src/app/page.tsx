'use client'

import React from 'react'

import { useAuth } from '@/utils/context/AuthContext'

export default function Page() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <h1>Welcome {user?.name} {user?.role}</h1>
    </div>
  );
}
