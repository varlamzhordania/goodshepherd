import {useRef, useEffect} from 'react';
import Janus from "janus-gateway"
import {AspectRatio} from "@/components/ui/aspect-ratio.jsx";

// eslint-disable-next-line react/prop-types
const Peer = ({data, remoteFeed}) => {
    const remoteVideo = useRef();
    let remoteTracks = {}
    const handlePeer = () => {
        // eslint-disable-next-line react/prop-types
        remoteFeed.onremotetrack = (track, mid, on, metadata) => {
            if (remoteTracks[mid] !== undefined) {
                if (!on) {
                    remoteTracks = remoteTracks.filter(item => item.id !== track.id);

                    delete remoteTracks[mid];
                } else {
                    remoteTracks[mid] = track;
                }

                const listTrack = Object.values(remoteTracks).filter(track => track !== null);
                const stream = new MediaStream(listTrack);
                Janus.attachMediaStream(remoteVideo.current, stream);
            }
        };

    };

    useEffect(() => {
        data?.streams?.forEach(stream => {
            remoteTracks[stream.mid] = null
        })
        handlePeer()

        return () => {
            remoteTracks = {}
        }

    }, [data]);

    return (
        <div className={"relative rounded-sm h-fit w-full border-2 border-zinc-600"} id={`peer-${data?.id}`}>
            <AspectRatio ratio={16 / 9}>
                <video ref={remoteVideo}
                       autoPlay
                       playsInline
                       className="object-cover h-full w-full bg-black/80 rounded-sm">
                </video>
            </AspectRatio>
            <div className={"absolute top-0 left-0 rounded-sm bg-primary px-2"}>
                <span className={"leading-normal capitalize text-sm text-white"}>{data.display}</span>
            </div>
        </div>

    );
};

export default Peer