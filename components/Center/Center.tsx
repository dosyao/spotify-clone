import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import Head from 'next/head';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from 'atoms/playlistAtom';
import useSpotify from '@hooks/useSpotify';
import Songs from '@components/Songs';

const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500'
];

const Center: React.FC = () => {
    const { data: session }: any = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState<string | null>(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist]: any = useRecoilState(playlistState);

    useEffect(() => {
        setColor(shuffle(colors).pop() as string);
    }, [playlistId]);

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then(data => {
            setPlaylist(data.body as any);
        }).catch(err => console.error('Something went wrong!', err));
    }, [spotifyApi, playlistId]);

    const handleSignOut = () => {
        signOut();
    }

    return (
        <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
            <Head>
                <meta name='theme-color' content={color?.split('-')[1]} />
            </Head>
            <header className='absolute top-5 right-8'>
                <div
                    className='flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'
                    onClick={handleSignOut}
                >
                    <img
                        className='rounded-full w-10 h-10'
                        src={session?.user.image}
                        alt=''
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className='h5 w-5' />
                </div>
            </header>
            <section className={`flex items-end text-white space-x-7 bg-gradient-to-b to-black ${color} h-80 padding-8 w-full p-8`}>
                <img
                    className='h-44 w-44 shadow-2xl'
                    src={playlist?.images?.[0]?.url}
                    alt=''
                />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    );
}

export default Center;
