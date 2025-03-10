import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthenticationToken, removeAuthenticationToken } from './axios_helper';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const authToken = localStorage.getItem('auth_token');

            if (!authToken || getAuthenticationToken() === null || getAuthenticationToken() === "null") {
                removeAuthenticationToken();
                localStorage.removeItem("loginInfo");
                router.push('/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
