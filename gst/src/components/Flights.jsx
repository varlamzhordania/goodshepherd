import {useQuery} from "@tanstack/react-query";
import {getFlightListApi} from "@/api/flightApi.js";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import Spinner from "@/components/Spinner.jsx";
import {Card, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const Flights = () => {

    const flightsQuery = useQuery({
        queryKey: ["flights"],
        queryFn: async () => {
            const response = await getFlightListApi()
            return response.json()
        }
    })

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    return (
        <Card className={"shadow-xl "}>
            <CardContent>
                <CardTitle className={"leading-10 text-3xl font-bold my-4"}>Flights</CardTitle>
                {
                    isSmallDevice ? (
                        <Carousel>
                            <CarouselContent>
                                {flightsQuery?.data?.map(flight =>
                                    <CarouselItem key={flight?.id}>
                                        <Table>
                                            <TableCaption>Flight Schedule</TableCaption>
                                            <TableBody className={"h-7 max-h-7"}>
                                                <TableRow>
                                                    <TableHead>Airline</TableHead>
                                                    <TableCell className={"text-nowrap"}>{flight?.airline}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Phone</TableHead>
                                                    <TableCell className={"text-nowrap"}>{flight?.airlinePhone}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Departure Airport</TableHead>
                                                    <TableCell>
                                                        <p className={"w-auto"}> {flight?.departure_airport}</p>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Arrive Airport</TableHead>
                                                    <TableCell>
                                                        <p className={"w-auto"}>{flight?.arrival_airport}</p>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Departure date</TableHead>
                                                    <TableCell className={"text-nowrap"}>{flight?.ddate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Arrive date</TableHead>
                                                    <TableCell className={"text-nowrap"}>{flight?.adate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Flight code</TableHead>
                                                    <TableCell
                                                        className={"text-nowrap"}>#{flight?.flightCode}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead>Ticket</TableHead>
                                                    <TableCell className={"text-nowrap"}>{flight?.ticketPnr}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className={"-left-10 md:-left-4 shadow-xl"}/>
                            <CarouselNext className={"-right-10 md:-right-4 shadow-xl"}/>
                        </Carousel>
                    ) : (
                        <Table>
                            <TableCaption>Flight Schedule</TableCaption>
                            <TableHeader className={"bg-secondary"}>
                                <TableRow>
                                    <TableHead>Airline</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Departure Airport</TableHead>
                                    <TableHead>Arrive Airport</TableHead>
                                    <TableHead>Departure date</TableHead>
                                    <TableHead>Arrive date</TableHead>
                                    <TableHead>Flight code</TableHead>
                                    <TableHead>Ticket</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className={"h-7 max-h-7"}>
                                {
                                    flightsQuery?.isLoading &&
                                    <TableRow><TableCell colSpan={12} align={"center"}><Spinner/></TableCell></TableRow>
                                }
                                {flightsQuery?.data?.map(flight =>
                                    (
                                        <TableRow key={flight?.id}>
                                            <TableCell className={"text-nowrap"}>{flight?.airline}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.airlinePhone}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.airlineEmail}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.departure_airport}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.arrival_airport}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.ddate}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.adate}</TableCell>
                                            <TableCell className={"text-nowrap"}>#{flight?.flightCode}</TableCell>
                                            <TableCell className={"text-nowrap"}>{flight?.ticketPnr}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                }

            </CardContent>
        </Card>
    )
}

export default Flights