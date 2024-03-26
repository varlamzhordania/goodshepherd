import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useQuery} from "@tanstack/react-query";
import {getTourListApi} from "@/api/tourApi.js";
import {useNavigate} from "react-router-dom";
import Spinner from "@/components/Spinner.jsx";
import {Card, CardContent, CardTitle} from "@/components/ui/card.jsx";

const TourRooms = () => {

    const navigate = useNavigate()


    const tourListQuery = useQuery({
        queryKey: ["tour_list"], queryFn: async () => {
            const response = await getTourListApi()
            return await response.json()
        }
    })


    const handleJoin = (id) => {
        navigate(`/room/${id}/`)
    }
    return (
        <Card className={"shadow-xl"}>
            <CardContent>
                <CardTitle className={"leading-10 text-3xl font-bold my-4"}>Group Calls</CardTitle>
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
                                    <TableCell className={"break-keep"}>
                                        <p>{tourListQuery?.data.tourname}</p>
                                    </TableCell>
                                    <TableCell><p>{tourListQuery?.data.tourleadername}</p></TableCell>
                                    <TableCell><p>{tourListQuery?.data.dcity}</p></TableCell>
                                    <TableCell><p>{tourListQuery?.data.bdate}</p></TableCell>
                                    <TableCell align={"center"}>
                                        <Button onClick={() => handleJoin(tourListQuery?.data.tour_id)}>Join</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    )
}

export default TourRooms