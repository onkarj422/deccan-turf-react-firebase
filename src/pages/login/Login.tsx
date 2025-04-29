import { Card } from "@mantine/core";
import GoogleLogo from '@assets/web_dark_rd_ctn.svg?react';
import { useLogin } from "@lib/firebase/auth/login";
import { useNavigate } from "@tanstack/react-router";

export default function Login() {
    const { loginWithGoogle } = useLogin();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate({ to: '/app' });
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <div className="flex flex-row flex-wrap grow py-16 px-10">
            <div className="text-center w-full">
                <h1 className="mb-5">Deccan Turfs</h1>
            </div>
            <div className="flex flex-col grow">
                <p className="text-gray-500 mb-5 self-center">Please login to continue</p>
                <Card padding="xl" shadow="sm" className="flex flex-row justify-center items-center gap-5">
                    <GoogleLogo onClick={handleGoogleLogin} className="cursor-pointer" />
                    {/* <p className="text-gray-500">OR</p>
                    <TextInput
                        placeholder="Email"
                        type="email"
                    />
                    <Button>CONTINUE</Button> */}
                </Card>
            </div>
        </div>
    )
}
