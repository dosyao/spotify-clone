import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

interface ILogin {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

const Login: NextPage<ILogin> = ({ providers }) => {
    const handleLogin = (id: string) => {
        signIn(id, { callbackUrl: '/' });
    }

    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
            <Head>
                <meta name='theme-color' content='#000000' />
            </Head>
            <img
                className='w-52 mb-5'
                src='https://i.imgur.com/fPuEa9V.png'
                width='768'
                height='768'
                alt='spotify-logo'
            />
            {Object.values(providers).map(provider => (
                <div key={provider.name}>
                    <button
                        className='bg-[#18D860] text-white p-5 rounded-full'
                        onClick={handleLogin.bind(null, provider.id)}
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}
