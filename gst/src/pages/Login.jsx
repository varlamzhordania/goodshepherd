import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useRef, useState} from "react";
import {useToast} from "@/components/ui/use-toast.js";
import {loginApi} from "@/api/userApi.js";
import {getUser, loginUser, showToast} from "@/lib/utils.js";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()
    const navigate = useNavigate()
    const emailInput = useRef()
    const passwordInput = useRef()
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const emailValue = emailInput.current.value;
            const passwordValue = passwordInput.current.value;

            if (emailValue === "") {
                return toast({description: "Email cannot be empty", variant: "destructive"});
            }
            if (passwordValue === "") {
                return toast({description: "Password cannot be empty", variant: "destructive"});
            }

            const prepData = {
                email: emailValue,
                password: passwordValue,
            };
            setIsLoading(prevState => !prevState)

            const response = await loginApi(prepData);
            setIsLoading(prevState => !prevState)
            if (!response.ok) {
                showToast(toast, "", "Login failed. Please check your credentials.", "error")
                throw new Error("Login failed. Please check your credentials.");
            }

            const data = await response.json();
            loginUser(data)
            showToast(toast, "", "Login successful.", "success")
            navigate("/")

        } catch (error) {
            setIsLoading(prevState => !prevState)
            console.error("Submit Error:", error);
            showToast(toast, "", "Login failed. Please try again.", "error")
        }
    };

    return (
        <div className={"container h-dvh flex justify-center items-center"}>
            <Card className={"h-fit shadow-xl"}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>you have to login to continue with using our application</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className={"my-3"}>
                            <Label htmlFor={"email"}>Email</Label>
                            <Input ref={emailInput} id={"email"} type={"email"}/>
                        </div>
                        <div className={"my-3"}>
                            <Label htmlFor={"password"}>Password</Label>
                            <Input ref={passwordInput} id={"password"} type={"password"}/>
                        </div>

                        <Button className={"w-full"} disabled={isLoading}>
                            {
                                isLoading ? "Processing" : "Login"
                            }

                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login