import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}


export const showToast = (toast, title, description, variant) => {
    let className = "";

    switch (variant) {
        case "success":
            className = "bg-green-50 text-green-600 border-2 border-green-300";
            break;
        case "info":
            className = "bg-blue-50 text-blue-600 border-2 border-blue-300";
            break;
        case "warning":
            className = "bg-yellow-50 text-yellow-600 border-2 border-yellow-300";
            break;
        case "error":
            className = "bg-red-50 text-red-600 border-2 border-red-300";
            break;
        default:
            className = "";
    }

    toast({title, description, className: className, duration: 5000});
};


export const loginUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data))
}
export const logoutUser = () => {
    localStorage.removeItem("user")
}

export const getUser = () => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
        const user = JSON.parse(userJson);
        return user.token ? user : null;
    } else {
        return null;
    }
}