import {
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon,
    ReplyIcon as ReplyOutline
} from '@heroicons/react/outline';
import {
    RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    VolumeUpIcon,
    ReplyIcon,
} from '@heroicons/react/solid';
import useSongInfo from '@hooks/useSongInfo';
import useSpotify from '@hooks/useSpotify';
import { currentTrackIdState, isPlayingState } from 'atoms/songAtom';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { debounce } from 'lodash';

const Player: React.FC = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState<number>(50);
    const [isRepeat, setRepeat] = useState<boolean>(false);
    const [isSort, setSort] = useState<boolean>(false);
    const songInfo: any = useSongInfo();

    useEffect(() => {
        setVolume(50);
        setRepeat(false);
        setSort(false);
        spotifyApi.setRepeat('off');
        spotifyApi.setShuffle(false);
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
        }
    }, [currentTrackIdState, spotifyApi, session]);

    useEffect(() => {
        if (volume >= 0 && volume <= 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustVolume = useCallback(debounce(volume => {
        spotifyApi.setVolume(volume).catch(err => console.error(err));
    }, 500), []);

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    }

    const handleChangeVolume = (e: any) => {
        setVolume(+e.target.value);
    }

    const handleDownVolume = () => {
        if (volume < 4) {
            setVolume(0);
            return null;
        }

        setVolume(volume - 5);
    }

    const handleUpVolume = () => {
        if (volume > 95) {
            setVolume(100);
            return null;
        }

        setVolume(volume + 5);
    }

    const handlePrevTrack = () => {
        spotifyApi.skipToPrevious();
        spotifyApi.play();
    }

    const handleNextTrack = () => {
        spotifyApi.skipToNext();
        spotifyApi.play();
    }

    const handleRepeat = () => {
        if (isRepeat) {
            spotifyApi.setRepeat('off').then(() => setRepeat(false));
        } else {
            spotifyApi.setRepeat('track').then(() => setRepeat(true));
        }
        
    }

    const handleSort = () => {
        if (isSort) {
            spotifyApi.setShuffle(false).then(() => setSort(false));
        } else {
            spotifyApi.setShuffle(true).then(() => setSort(true));
        }
    }

    return (
        <div className='text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-1 md:grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className='hidden md:flex items-center space-x-4'>
                <img
                    className='hidden md:inline h-10 w-10'
                    src={songInfo?.album.images?.[0]?.url}
                    alt=''
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon
                    className={`button ${isSort && 'text-green-500'}`}
                    onClick={handleSort}
                />
                <RewindIcon
                    className='button'
                    onClick={handlePrevTrack}
                />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className='button w-10 h-10' />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />
                )}
                <FastForwardIcon
                    className='button active:text-green-500'
                    onClick={handleNextTrack}
                />
                <ReplyIcon
                    className={`button ${isRepeat && 'text-green-500'}`}
                    onClick={handleRepeat}
                />
            </div>
            <div className='hidden md:flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeDownIcon className='button' onClick={handleDownVolume} />
                <input
                    className='w-14 md:w-28'
                    type='range'
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleChangeVolume}
                />
                <VolumeUpIcon className='button' onClick={handleUpVolume} />
            </div>
        </div>
    );
}

export default Player;
