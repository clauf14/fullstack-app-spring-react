// hoc/withAuth.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthenticationToken } from './axios_helper';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const authToken = localStorage.getItem('auth_token');

            if (!authToken || getAuthenticationToken() === null && getAuthenticationToken() === "null") {
                router.push('/login');
                localStorage.removeItem("loginInfo");
                localStorage.removeItem("auth_token");
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
