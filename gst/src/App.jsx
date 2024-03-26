import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Login from "@/pages/Login.jsx";
import {getUser} from "@/lib/utils.js";
import Error from "@/pages/Error.jsx";
import RootLayout from "@/components/layout/RootLayout.jsx";
import Room from "@/pages/Room.jsx";

const ProtectedRoute = ({children}) => {
    const user = getUser()
    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

const App = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><RootLayout><Home/></RootLayout></ProtectedRoute>,
        errorElement: <Error/>,

    },
    {
        path: "/login",
        element: <Login/>,
        errorElement: <Error/>,
    },
    {
        path: "/room/:tour_id",
        element: <ProtectedRoute><Room/></ProtectedRoute>,
        errorElement: <Error/>,
    },
]);

export default App

