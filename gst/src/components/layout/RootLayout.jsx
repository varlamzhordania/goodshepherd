import Navbar from "@/components/Navbar.jsx";

const RootLayout = ({children}) => {
    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}
export default RootLayout