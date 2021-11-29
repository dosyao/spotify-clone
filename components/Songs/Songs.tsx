import { playlistState } from 'atoms/playlistAtom';
import { useRecoilValue } from 'recoil';
import Song from './Song';

const Songs: React.FC = () => {
    const playlist: any = useRecoilValue(playlistState);

    return (
        <div className='text-white px-8 flex flex-col space-y-1 pb-20'>
            {playlist?.tracks.items.map((track: any, idx: number) => (
                <Song
                    key={`${playlist.id}_${track.track.id}_${idx}`}
                    order={idx + 1}
                    track={track}
                    tracks={playlist?.tracks.items}
                />
            ))}
        </div>
    )
}

export default Songs;
