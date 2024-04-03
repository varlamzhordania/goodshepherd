import {useQuery} from "@tanstack/react-query";
import {getItineraryListApi} from "@/api/itineraryApi.js";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.jsx";
import {useRef, useState} from "react";
import Spinner from "@/components/Spinner.jsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {AspectRatio} from "@/components/ui/aspect-ratio.jsx";
import Placeholder from "@/../public/placeholder.png"
import {AiOutlineArrowLeft} from "react-icons/ai";

const Sights = () => {
    const [selected, setselected] = useState({})
    const [sliderElements, setSliderElements] = useState([])
    const modal = useRef()
    const modalBody = useRef()
    const sightsQuery = useQuery({
        queryKey: ["sights"],
        queryFn: async () => {
            const response = await getItineraryListApi()
            return response.json()
        }
    })


    const handleClick = (item) => {
        setselected(item);

        const sliderElements = item.cont.map((cont, index) => (
            <div key={index}>
                <Carousel className="w-full">
                    <CarouselContent className="-ml-1">
                        {Object.keys(cont?.sight).map((key, index) => {
                                if (key !== "description" && key !== "name")
                                    return cont.sight[key] ? <CarouselItem key={index}
                                                                           className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                                        <Card>
                                            <CardContent className={"relative p-0 rounded-lg overflow-hidden"}>
                                                <AspectRatio ratio={16 / 9}>
                                                    <iframe src={cont.sight[key]}
                                                            className={"w-full h-full object-cover"} allowFullScreen ></iframe>
                                                </AspectRatio>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem> : <CarouselItem key={index}
                                                                    className="pl-1 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                        <Card>
                                            <CardContent className={"relative p-0 rounded-lg overflow-hidden"}>
                                                <AspectRatio ratio={16 / 9}>
                                                    <img
                                                        src={Placeholder}
                                                        className={"w-full h-full"}/>
                                                </AspectRatio>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                            }
                        )}
                    </CarouselContent>
                    <CarouselPrevious className={"-left-4 md:-left-4 shadow-xl"}/>
                    <CarouselNext className={"-right-4 md:-right-4 shadow-xl"}/>
                </Carousel>
                <p className="my-2">
                    <span className="text-md font-bold text-black/70">{index + 1}</span>
                    <span className="font-medium text-black/70">{cont.location}</span>: <br/>
                    <p className="leading-7 text-black/60">{cont.activity}</p>
                </p>
                <hr className="my-2"/>
            </div>
        ));

        setSliderElements(sliderElements); // assuming you have a state variable to hold the slider elements

        modal.current.showModal();
    }


    return (
        <div>
            <p className={"leading-10 text-3xl font-bold mb-4"}>Tour Timeline</p>
            <ScrollArea>
                <ul className="timeline timeline-vertical lg:timeline-horizontal pb-12 ">
                    {
                        sightsQuery.isLoading &&
                        <div className={"w-full flex justify-center items-center"}><Spinner/></div>
                    }
                    {
                        !sightsQuery.isLoading && sightsQuery?.data.length > 0 && sightsQuery?.data?.map((item, index) =>
                            <li key={item?.id} className={"grid-rows-2"}>
                                {index !== 0 && <hr/>}

                                <div className="timeline-start min-w-40">

                                </div>
                                <div className="timeline-middle cursor-pointer" onClick={() => handleClick(item)}
                                     key={item?.id}>
                                    <div
                                        className={"bg-primary text-white rounded-lg w-12 h-12 flex flex-col text-center item-center justify-center "}>
                                        <span className={"font-bold text-md"}>{item?.cont && item?.cont[0]?.day}</span>
                                        <span className={"text-xs"}>Day</span>
                                    </div>
                                </div>
                                {index !== sightsQuery?.data?.length - 1 && <hr/>}
                            </li>
                        )
                    }

                </ul>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>

            <dialog ref={modal} className="modal">
                <div className="modal-box xl:w-1/2 rounded-lg  w-11/12 max-w-full">
                    <div className={"flex justify-between align-middle"}>
                        <form method="dialog">
                            <button className="btn btn-ghost  text-lg  ">
                                <AiOutlineArrowLeft />
                                Back
                            </button>
                        </form>
                        {/*<form method="dialog">*/}
                        {/*    <button className="btn btn-circle btn-ghost text-lg">✕</button>*/}
                        {/*</form>*/}
                    </div>
                    <div className={"mt-3"} ref={modalBody}>
                        {sliderElements.map(element => element)}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>


        </div>

    )

}


export default Sights