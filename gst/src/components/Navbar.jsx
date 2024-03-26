import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Link, useLocation, useNavigate} from "react-router-dom";
import {getUser, logoutUser, showToast} from "@/lib/utils.js";
import {useToast} from "@/components/ui/use-toast.js";

const Navbar = () => {
    const userData = getUser()
    const location = useLocation()
    const navigate = useNavigate()
    const {toast} = useToast()
    const handleLogout = () => {
        logoutUser()
        showToast(toast, "", "Logout successfully.", "info")
        navigate("/login")
    }

    return (
        <div className={"border-b py-3"}>
            <div className={"container"}>
                <NavigationMenu className={"w-full max-w-screen-xl justify-between"}>
                    <NavigationMenuList className={"space-x-5 items-end"}>
                        <NavigationMenuItem>
                            <Link to={"/"}>
                                <img src={"/logo1.png"} width={124} height={124} className={"object-cover"}
                                     alt={"goodshepherd tours logo"}/>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className={"hidden lg:block"}>
                            <Link to={"/"}>
                                <NavigationMenuLink active={location.pathname === "/"}
                                                    className={navigationMenuTriggerStyle()}>
                                    Dashboard
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    <NavigationMenuList className={"space-x-5 items-end"}>
                        <NavigationMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarFallback>{userData?.user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel className={"capitalize"}>{userData?.user?.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={handleLogout} className={"cursor-pointer"}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

export default Navbar