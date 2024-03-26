import Sights from "@/components/Sights.jsx";
import Flights from "@/components/Flights.jsx";
import TourRooms from "@/components/TourRooms.jsx";
import Hotels from "@/components/Hotels.jsx";
import {getUser} from "@/lib/utils.js";


const Home = () => {
    const userData = getUser()

    return (
        <div className={"container flex flex-col justify-center mt-12 gap-12 pb-5"}>
            <p className="leading-5 font-bold text-lg text-gray-700">
                Hello <span className={"lowercase"}>{userData.user.name}</span>, welcome to your dashboard! Here, you'll find all the details about your
                tour. Thank you for choosing us!
            </p>
            <Hotels/>
            <TourRooms/>
            <Flights/>
            <Sights/>
        </div>
    )
}


export default Home