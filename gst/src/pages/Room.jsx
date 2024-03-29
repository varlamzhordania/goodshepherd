import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {AiFillAudio, AiFillVideoCamera} from "react-icons/ai";
import Peer from "@/components/Peer.jsx";
import {getUser} from "@/lib/utils.js";
import Janus from "janus-gateway";
import adapter from "webrtc-adapter"


let mapPeers = {}
let subscriptionCreated = false;
const Room = () => {
    window['adapter'] = adapter

    const [constraints, setConstraints] = useState({video: true, audio: true});
    const [, forceUpdate] = useState();
    const localVideo = useRef();
    const btnAudio = useRef();
    const btnVideo = useRef();
    const userData = getUser();
    let {tour_id} = useParams();
    let subscribeStarted = false;
    const bitrate = 1024 * 512;

    let localStream = {}
    let janus = null;
    let publishers = []
    let videoroom = null;
    let myId = null;
    let privateID = null;
    let myStream = null;
    let remoteFeed = null;
    let subStreams = {};
    let audioMuted = true;
    let videoMuted = true;

    const rerender = () => {
        forceUpdate(Math.random()); // Update state with a random value
    };
    const checkExistRoom = () => {
        videoroom.send({
            message: {
                request: "exists",
                room: Number(tour_id)
            },
            success: function (response) {
                const roomExists = response.exists;

                if (roomExists) {
                    joinRoom()
                } else {
                    createRoom()
                }
            },
            error: function (error) {
                console.error("Error checking room existence", error);
            }
        });
    }

    const joinRoom = () => {
        videoroom.send({
            message: {
                request: "join",
                ptype: "publisher",
                room: Number(tour_id),
                display: userData.user.name,
                id: userData.user.id,
                bitrate: bitrate,
            },
            success: function () {
            },
            error: function (error) {
                console.error("Error joining room ", error);
            },
        })
    }

    const createRoom = () => {
        videoroom.send({
            message: {
                request: "create",
                bitrate: bitrate,
                room: Number(tour_id),
                audiolevel_ext: true,
                audiolevel_event: true,
                audio_active_packets: 50,
                audio_level_average: 40,
                permanent: false,

            },
            success: function () {
                joinRoom()
            },
            error: function (error) {
                console.error("Error creating room ", error);
            }
        })
    }

    const publishOwnFeed = (useAudio) => {
        // Publish our stream
        videoroom.createOffer(
            {
                iceRestart: true,
                tracks: [
                    {
                        "type": "audio",
                        "capture": true,
                        "add": true,
                    },
                    {
                        "type": "video",
                        "capture": true,
                        "add": true,
                    }
                ],
                success: function (jsep) {
                    const publish = {"request": "configure", "audio": useAudio, "video": true};
                    videoroom.send({"message": publish, "jsep": jsep});
                },
                error: function (error) {
                    Janus.error("WebRTC error:", error);
                    if (useAudio) {
                        publishOwnFeed(false);
                    }
                }
            });
    }

    const handleToggleMute = () => {
        if (audioMuted) {
            console.log("to mute")
            videoroom.createOffer(
                {
                    iceRestart: true,
                    tracks: [
                        {
                            "type": "audio",
                            "capture": false,
                            "add": false,
                        },
                    ],
                    success: function (jsep) {
                        const publish = {"request": "configure", "audio": false};
                        videoroom.send({"message": publish, "jsep": jsep});
                    },
                    error: function (error) {
                        Janus.error("WebRTC error:", error);
                    }
                });
        } else {
            console.log("to unmute")
            videoroom.createOffer(
                {
                    iceRestart: true,
                    tracks: [
                        {
                            "type": "audio",
                            "capture": true,
                            "add": true,
                        },
                    ],
                    success: function (jsep) {
                        const publish = {"request": "configure", "audio": true};
                        videoroom.send({"message": publish, "jsep": jsep});
                    },
                    error: function (error) {
                        Janus.error("WebRTC error:", error);
                    }
                });

        }
        audioMuted = !audioMuted
        setConstraints(prevState => ({...prevState, audio: !prevState.audio}))
    }

    const handleToggleVideo = () => {
        if (videoMuted) {
            console.log("to mute Video")
            videoroom.createOffer(
                {
                    iceRestart: true,
                    tracks: [
                        {
                            "type": "video",
                            "capture": false,
                            "add": false,
                        },
                    ],
                    success: function (jsep) {
                        const publish = {"request": "configure", "video": false};
                        videoroom.send({"message": publish, "jsep": jsep});
                    },
                    error: function (error) {
                        Janus.error("WebRTC error:", error);
                    }
                });
        } else {
            console.log("to unmute")
            videoroom.createOffer(
                {
                    iceRestart: true,
                    tracks: [
                        {
                            "type": "video",
                            "capture": true,
                            "add": true,
                        },
                    ],
                    success: function (jsep) {
                        const publish = {"request": "configure", "video": true};
                        videoroom.send({"message": publish, "jsep": jsep});
                    },
                    error: function (error) {
                        Janus.error("WebRTC error:", error);
                    }
                });

        }
        videoMuted = !videoMuted
        setConstraints(prevState => ({...prevState, video: !prevState.video}))
    }
    const checkCompatible = (stream) => {
        if (stream.type === "video" && Janus.webRTCAdapter.browserDetails.browser === "safari" &&
            ((stream.codec === "vp9" && !Janus.safariVp9) || (stream.codec === "vp8" && !Janus.safariVp8))) {
            console.log("Publisher is using " + stream.codec.toUpperCase +
                ", but Safari doesn't support it: disabling video stream #" + stream.mindex);
        }
    }
    const checkStream = (stream) => {
        if (stream.disabled) {
            Janus.log("Disabled stream:", stream);
            // TODO Skipping for now, we should unsubscribe
        }
    }

    const readyStream = (id, streams) => {
        const streamData = []
        streams.forEach(stream => {
            // If the publisher is VP8/VP9 and this is an older Safari, let's avoid video
            checkCompatible(stream)
            checkStream(stream)
            const streamDataObj = {
                feed: id,	        // This is mandatory
                mid: stream?.mid		// This is optional (all streams, if missing)
            }
            streamData.push(streamDataObj)
        })
        return streamData
    }
    const handleJoin = (streamData) => {
        let body;

        if (subscribeStarted === true) {
            body = {
                request: "subscribe",
                streams: streamData,
            };
        } else {
            body = {
                request: "join",
                room: Number(tour_id),
                ptype: "subscriber",
                streams: streamData,
                use_msid: false,
                private_id: privateID,
            };
        }

        // eslint-disable-next-line react/prop-types
        remoteFeed.send({message: body});
    }

    const handlePublishers = (data) => {

        data.forEach((item) => {
            if (item.id !== userData.user.id) {
                // Ignore self
                const component = (
                    <Peer
                        key={item.id}
                        tour_id={tour_id}
                        primaryId={privateID}
                        data={item}
                        remoteFeed={remoteFeed}
                        subscribeStarted={subscribeStarted}
                    />
                );
                mapPeers[item.id] = [item, component];

                handleJoin(readyStream(item.id, item.streams));
                subscribeStarted = true;
            }
        });

        rerender()

    };


    const handlePublisherLeave = (id) => {
        // setMapComponents(prevComponents => {
        //     return prevComponents.filter(component => component.id !== id);
        // });
        delete mapPeers[id]
        rerender()
    }
    const handleNewPublishers = (data) => {
        handlePublishers(data)
    }
    const handleEventJoin = (msg) => {
        myId = msg.id
        privateID = msg.private_id
        publishOwnFeed(true)

        btnAudio.current.addEventListener("click", handleToggleMute)
        btnVideo.current.addEventListener("click", handleToggleVideo)

        if (msg.publishers) {
            publishers = msg.publishers
        }
        createSubscriptionPlugin()
    }

    const handleTalking = (msg) => {
        const peer = document.querySelector(`#peer-${msg.id}`)
        if (msg.videoroom === "talking") {
            peer?.classList?.remove("border-zinc-600")
            peer?.classList?.add("border-green-600")
        } else {
            peer?.classList?.remove("border-green-600")
            peer?.classList?.add("border-zinc-600")
        }


    }


    const initializeJanus = () => {
        Janus.init({
            debug: false,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            dependencies: Janus.useDefaultDependencies(),
            callback: function () {
                // Create session
                janus = new Janus({
                    server: 'wss://voice.goodshepherd.tours:8989',
                    iceServers: [{url: "turn:49.13.124.44:3478", username: "gst", credential: "gst"}],
                    success: function () {
                        console.log("connected to janus")
                        // Session created, now attaching to VideoRoom plugin
                        attachToVideoRoomPlugin();
                    },
                    error: function (error) {
                        console.error("Janus error", error);
                    },
                    destroyed: function () {
                        console.log("Janus destroyed");
                    },
                });
            },
        });
    };
    const createSubscriptionPlugin = () => {

        if (subscriptionCreated) {
            // Still working on the handle, send this request later when it's ready
            setTimeout(function () {
                createSubscriptionPlugin();
            }, 500);
            return;
        }
        janus.attach(
            {
                plugin: "janus.plugin.videoroom",
                success: function (pluginHandle) {
                    remoteFeed = pluginHandle
                    handlePublishers(publishers)

                },
                error: function (error) {
                    Janus.error("  -- Error attaching plugin...", error);
                    setTimeout(function () {
                        janus.reconnect({
                            success: function () {
                                // console.log("Session successfully reclaimed:", janus.getSessionId());
                                // console.log("Reconnected!");
                            },
                            error: function (err) {
                                console.error("Failed to reconnect:", err);
                                // Might have an exponential backoff, here, or simply fail
                            }
                        });
                    }, 2000);
                },
                onmessage: function (msg, jsep) {
                    let event = msg?.videoroom;
                    if (msg?.error) {
                        if (msg?.error === "Already in as a subscriber on this handle") {
                            // ignore
                        } else {
                            console.log("error", msg.error)
                        }
                    } else if (event) {
                        if (event === "attached") {
                            // console.log("got attached")
                            subscribeStarted = true
                        } else if (event === "event") {
                            // Check if we got an event on a simulcast-related event from this publisher
                            // let mid = msg["mid"];
                            // let substream = msg["substream"];
                            // let temporal = msg["temporal"];
                            // TODO (handle simulcast)
                        }
                    }
                    if (msg?.streams) {
                        // Update map of subscriptions by mid
                        // console.log("update subscriptions", msg)
                        msg?.streams.forEach(stream => {
                            subStreams[stream.mid] = stream;
                        })
                    }
                    if (jsep) {
                        Janus.debug("Handling SDP as well...", jsep);
                        // Answer and attach
                        remoteFeed.createAnswer(
                            {
                                jsep: jsep,
                                tracks: [
                                    {
                                        "type": "audio",
                                        "recv": true,
                                        "add": true,
                                    },
                                    {
                                        "type": "video",
                                        "recv": true,
                                        "add": true,
                                    }
                                ],
                                success: function (jsep) {
                                    Janus.debug("Got SDP!", jsep);
                                    let body = {request: "start", room: Number(tour_id)};
                                    remoteFeed.send({message: body, jsep: jsep});
                                },
                                error: function (error) {
                                    console.error("WebRTC error:", error);
                                }
                            });
                    }
                },
                iceState: function (state) {
                    Janus.log("ICE state of this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") changed to " + state);
                },
                webrtcState: function (on) {
                    Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
                },
                oncleanup: function () {
                    Janus.log(" ::: Got a cleanup notification (remote feed) :::");
                    if (remoteFeed.spinner)
                        remoteFeed.spinner.stop();
                    alert("remote feed spinner stop")
                }
            });
    }

    const attachToVideoRoomPlugin = () => {
        janus.attach({
            plugin: "janus.plugin.videoroom",
            success: function (pluginHandle) {
                videoroom = pluginHandle;
                // Check if the room exists
                checkExistRoom()
            },
            error: function (error) {
                console.error("Error attaching to VideoRoom plugin", error);
                setTimeout(function () {
                    janus.reconnect({
                        success: function () {
                            // console.log("Session successfully reclaimed:", janus.getSessionId());
                            // console.log("Reconnected!");
                        },
                        error: function (err) {
                            console.error("Failed to reconnect:", err);
                            // Might have an exponential backoff, here, or simply fail
                        }
                    });
                }, 2000);
            },
            consentDialog: function (on) {
                console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
            },
            mediaState: function (medium, on) {
                console.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
            },
            webrtcState: function (on) {
                console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            },
            onmessage: function (msg, jsep) {
                const event = msg['videoroom'];
                switch (event) {
                    case "joined":
                        handleEventJoin(msg)
                        break
                    case "destroyed":
                        // The room has been destroyed
                        if (window.confirm("The room has been destroyed. Reload the page?")) {
                            window.location.reload();
                        }
                        break
                    case "event":
                        if (msg.unpublished || msg.leaving) {
                            handlePublisherLeave(msg.unpublished || msg.leaving)
                            break
                        } else if (msg.publishers) {
                            handleNewPublishers(msg.publishers)
                            break
                        }
                        console.log("new event that need to be handled", msg)
                        break
                    case "talking":
                        handleTalking(msg)
                        break
                    case "stopped-talking":
                        handleTalking(msg)
                        break
                    default:
                        console.log("got an unhandled event onmessage inside videoroom handler", msg)
                        break
                }
                if (jsep) {
                    videoroom.handleRemoteJsep({jsep: jsep});
                    // Check if any of the media we wanted to publish has
                    // been rejected (e.g., wrong or unsupported codec)
                    const audio = msg.audio_codec
                    const video = msg.video_codec
                    if (myStream && myStream.getAudioTracks() && myStream.getAudioTracks().length > 0 && !audio) {
                        // Audio has been rejected
                        console.error("Our audio stream has been rejected, viewers won't hear us");
                    }
                    if (myStream && myStream.getVideoTracks() && myStream.getVideoTracks().length > 0 && !video) {
                        // Video has been rejected
                        console.error("Our video stream has been rejected, viewers won't see us");
                    }
                }
            },
            onlocaltrack: function (track, on) {
                if (!on) {
                    // Track removed, get rid of the stream and the rendering
                    const stream = localStream[track.id];
                    if (stream) {
                        try {
                            let tracks = stream.getTracks();
                            tracks.forEach(item =>
                                item.stop()
                            )
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    if (track.kind === "video") {
                        localVideo.current.srcObject = null
                    }
                    delete localStream[track.id];
                    console.log("local stream removed and video src object = null")
                    return;
                }

                if (track.kind === "audio") {
                    // We ignore local audio tracks, they'd generate echo anyway
                } else {
                    myStream = new MediaStream([track]);
                    localStream[track.id] = myStream
                    Janus.attachMediaStream(localVideo.current, localStream[track.id]);
                }
                if (videoroom.webrtcStuff.pc.iceConnectionState !== "completed" &&
                    videoroom.webrtcStuff.pc.iceConnectionState !== "connected") {
                    console.log("ice connection completed")
                }
            },
            oncleanup: function () {
                console.log(" ::: Got a cleanup notification: we are unpublished now :::");
                localVideo.current.srcObject = null
            },

        });
    }


    useEffect(() => {
        initializeJanus()
        // initializeMedia()
        // setupWebSocket(tour_id)
    }, [tour_id])


    return (
        <div className={"flex flex-col relative h-dvh bg-black/80"}>
            <div className={"p-4 lg:p-0"}>
                <video ref={localVideo} autoPlay playsInline
                       className="aspect-video rounded-sm border-2 border-zinc-600 object-cover w-full h-15 md:h-full max-h-dvh bg-black/80"></video>
            </div>
            <div
                className={"grid grid-cols-2 lg:grid-cols-1 gap-2 lg:absolute lg:right-0 lg:top-0 w-full lg:w-1/5 h-full lg:h-auto max-h-full overflow-y-auto p-4 lg:p-2 lg:bg-transparent"}>
                {Object.keys(mapPeers).map(key => mapPeers[key][1])}
            </div>
            <div
                className={"fixed bottom-0 mt-auto flex justify-center align-middle flex-row gap-3 w-full bg-zinc-800 py-2 self-end justify-self-end"}>
                <Button ref={btnVideo} name={"video"}
                        variant={constraints.video ? "success" : "destructive"}
                        className={"rounded-full text-xl w-[50px] h-[50px]"}><AiFillVideoCamera/>
                </Button>
                <Button ref={btnAudio} name={"audio"}
                        variant={constraints.audio ? "success" : "destructive"}
                        className={"rounded-full text-xl w-[50px] h-[50px]"}><AiFillAudio/>
                </Button>
            </div>
        </div>
    );
};

export default Room