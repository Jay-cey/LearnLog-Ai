'use client';

import { useSession } from 'next-auth/react';

export function useCurrentUser() {
    const { data: session, status } = useSession();
    
    return {
        user: session?.user,
        // @ts-ignore - backend UUID from our sync endpoint
        userId: session?.user?.backendId as string | undefined,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated',
    };
}
