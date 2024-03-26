


export const loginApi = async (data) => {
    try {
        const formData = new FormData()
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("device_name", "web")

        const response = await fetch("/api/login", {
            method: "post",
            body: formData
        })

        if (!response.ok) {
            throw new Error(`Failed to log in. Status: ${response.status}`);
        }

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("Failed to log in. Please try again.");
    }
}
