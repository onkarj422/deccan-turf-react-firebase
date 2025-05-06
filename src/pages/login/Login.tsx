import GoogleLogo from '@assets/web_dark_rd_ctn.svg?react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@tanstack/react-router';

export default function Login() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
        navigate({ to: '/' });
    };

    return (
        <div className="flex flex-row flex-wrap grow py-16 px-10">
            <div className="text-center w-full">
                <h1 className="mb-5">Deccan Turfs</h1>
            </div>
            <div className="flex flex-col grow">
                <p className="text-gray-500 mb-5 self-center">Please login to continue</p>
                <GoogleLogo
                    onClick={handleGoogleLogin}
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
}
