import {useQuery} from "@tanstack/react-query";
import {getFlightListApi} from "@/api/flightApi.js";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import Spinner from "@/components/Spinner.jsx";
import {Card, CardContent, CardTitle} from "@/components/ui/card.jsx";

const Flights = () => {

    const flightsQuery = useQuery({
        queryKey: ["flights"],
        queryFn: async () => {
            const response = await getFlightListApi()
            return response.json()
        }
    })

    return (
        <Card className={"shadow-xl "}>
            <CardContent>
                <CardTitle className={"leading-10 text-3xl font-bold my-4"}>Flights</CardTitle>
                <Table>
                    <TableCaption>Flight Schedule</TableCaption>
                    <TableHeader className={"bg-secondary"}>
                        <TableRow>

                            <TableHead>Airline</TableHead>
                            <TableHead>Airline</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Departure City</TableHead>
                            <TableHead>Arrive City</TableHead>
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
                                    <TableCell className={"break-keep"}>{flight?.airline}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.airlinePhone}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.airlineEmail}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.dcity?.join("-")}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.acity?.join("-")}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.ddate}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.adate}</TableCell>
                                    <TableCell className={"break-keep"}>#{flight?.flightCode}</TableCell>
                                    <TableCell className={"break-keep"}>{flight?.ticketPnr}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Flights