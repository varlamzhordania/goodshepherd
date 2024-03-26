import {getUser} from "@/lib/utils.js";


export const getTourListApi = async () => {
    try {
        const userData = getUser()

        const formData = new FormData()
        formData.append("email", userData?.user?.email)
        formData.append("token", userData?.token)
        const response = await fetch( `/api/passenger`, {
            method: "post",
            body: formData
        })

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Failed to get tour list. Please try again.");
    }
}


export const getTourRoomApi = async (id) => {
    try {
        const userData = getUser()

        const formData = new FormData()
        formData.append("tour_id", id)
        formData.append("token", userData?.token)
        const response = await fetch(`/api/tour_room`, {
            method: "post",
            body: formData
        })

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Failed to get tour list. Please try again.");
    }
}


export const updateTourRoomApi = async (id,rtc_data) => {
    try {
        const userData = getUser()

        const formData = new FormData()
        formData.append("tour_id", id)
        formData.append("rtc_data", JSON.stringify(rtc_data))
        formData.append("is_active", 1)
        formData.append("token", userData?.token)
        const response = await fetch( `/api/tour_room/update`, {
            method: "post",
            body: formData
        })

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Failed to get tour list. Please try again.");
    }
}