import {getUser} from "@/lib/utils.js";


export const getFlightListApi = async () => {
    try {
        const userData = getUser()

        const formData = new FormData()
        formData.append("email", userData?.user?.email)
        formData.append("token", userData?.token)
        const response = await fetch(`/api/flight`, {
            method: "post",
            body: formData
        })

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Failed to get hotel list. Please try again.");
    }
}