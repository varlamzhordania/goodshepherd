import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useQuery} from "@tanstack/react-query";
import {getTourListApi} from "@/api/tourApi.js";
import {useNavigate} from "react-router-dom";
import Spinner from "@/components/Spinner.jsx";
import {Card, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";


const TourRooms = () => {

    const navigate = useNavigate()
    const tourListQuery = useQuery({
        queryKey: ["tour_list"], queryFn: async () => {
            const response = await getTourListApi()
            return await response.json()
        }
    })

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");


    const handleJoin = (id) => {
        navigate(`/room/${id}/`)
    }
    return (
        <Card className={"shadow-xl"}>
            <CardContent>
                <CardTitle className={"leading-10 text-3xl font-bold my-4"}>Group Calls</CardTitle>
                {
                    isSmallDevice ?
                        (
                            <Table>
                                <TableCaption>Group List</TableCaption>
                                <TableBody>
                                    {
                                        tourListQuery?.isLoading &&
                                        <TableRow><TableCell colSpan={12}
                                                             align={"center"}><Spinner/></TableCell></TableRow>
                                    }
                                    {tourListQuery?.data &&
                                        (
                                            <>
                                                <TableRow>
                                                    <TableHead className={"text-nowrap"}>Tour</TableHead>
                                                    <TableCell
                                                        className={"text-nowrap"}>{tourListQuery?.data.tourname}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead className={"text-nowrap"}>Leader</TableHead>
                                                    <TableCell
                                                        className={"text-nowrap"}>{tourListQuery?.data.tourleadername}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead className={"text-nowrap"}>City</TableHead>
                                                    <TableCell
                                                        className={"text-nowrap"}>{tourListQuery?.data.dcity}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead className={"text-nowrap"}>Date</TableHead>
                                                    <TableCell
                                                        className={"text-nowrap"}>{tourListQuery?.data.bdate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead className={"text-nowrap"}>Action</TableHead>
                                                    <TableCell align={"start"}>
                                                        <Button
                                                            onClick={() => handleJoin(tourListQuery?.data.tour_id)}>Join</Button>
                                                    </TableCell>
                                                </TableRow>

                                            </>
                                        )}
                                </TableBody>
                            </Table>
                        )
                        : (
                            <Table>
                                <TableCaption>Group List</TableCaption>
                                <TableHeader className={"bg-secondary"}>
                                    <TableRow>
                                        <TableHead>Tour</TableHead>
                                        <TableHead>Leader</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className={"text-center"}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        tourListQuery?.isLoading &&
                                        <TableRow><TableCell colSpan={12} align={"center"}><Spinner/></TableCell></TableRow>
                                    }
                                    {tourListQuery?.data &&
                                        (
                                            <TableRow key={tourListQuery?.data.tour_id}>
                                                <TableCell
                                                    className={"text-nowrap"}>{tourListQuery?.data.tourname}</TableCell>
                                                <TableCell
                                                    className={"text-nowrap"}>{tourListQuery?.data.tourleadername}</TableCell>
                                                <TableCell className={"text-nowrap"}>{tourListQuery?.data.dcity}</TableCell>
                                                <TableCell className={"text-nowrap"}>{tourListQuery?.data.bdate}</TableCell>
                                                <TableCell align={"center"}>
                                                    <Button
                                                        onClick={() => handleJoin(tourListQuery?.data.tour_id)}>Join</Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        )
                }

            </CardContent>
        </Card>

    )
}

export default TourRooms