import {Card, CardContent} from "@/components/ui/card"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"

import {useQuery} from "@tanstack/react-query";
import {getHotelListApi} from "@/api/hotelApi.js";
import Spinner from "@/components/Spinner.jsx";
import {IMAGE_UPLOADS} from "@/lib/config.js";
import {CalendarDays, Phone} from "lucide-react";

const Hotels = () => {

    const hotelsQuery = useQuery({
        queryKey: ["hotels"],
        queryFn: async () => {
            const response = await getHotelListApi()
            return await response.json()
        }
    })

    const calculateDays = (data) => {
        const date1 = new Date(data.fromD);
        const date2 = new Date(data.toD);

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date2 - date1);

        // Convert milliseconds to days
        return Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) || 1
    }

    return (
        <div className={"w-full"}>
            <p className={"leading-10 text-3xl font-bold mb-4"}>Hotels</p>
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {hotelsQuery.isLoading &&
                        <CarouselItem className="pl-1"><Spinner/></CarouselItem>
                    }
                    {hotelsQuery?.data?.map(hotel => (
                        <CarouselItem key={hotel?.id} className="pl-1 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <Card>
                                <CardContent className={"relative p-0 rounded-lg overflow-hidden"}>
                                    <img src={IMAGE_UPLOADS + "/hotel-profile/" + hotel.image} alt={hotel?.name}
                                         className={"rounded-lg object-cover"}/>
                                    <div
                                        className={"absolute h-full w-full z-1 bg-gradient-to-t from-black/70 to-black/10 top-0 left-0 text-white"}>
                                        <div className={"w-full h-full p-4 flex flex-col align-bottom justify-end"}>
                                            <div className={"flex flex-col gap-1"}>
                                                <div className={"flex gap-1 items-center justify-start"}>
                                                    <p className={"leading-5"}>{hotel.name}</p>
                                                </div>
                                                <div className={"flex gap-1 items-center justify-start text-sm"}>
                                                    <p className={"leading-normal"}>{hotel.adress}</p>
                                                </div>
                                                <div className={"flex gap-2 mt-1"}>
                                                    <div className={"flex gap-1 items-center justify-start text-sm"}>
                                                        <CalendarDays className={"size-4"}/>
                                                        {calculateDays(hotel)} Day
                                                    </div>
                                                    <div className={"flex gap-1 items-center justify-start text-sm"}>
                                                        <Phone className={"size-4"}/>
                                                        {hotel.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className={"-left-4 md:-left-4 shadow-xl"}/>
                <CarouselNext className={"-right-4 md:-right-4 shadow-xl"}/>
            </Carousel>
        </div>
    )
}

export default Hotels