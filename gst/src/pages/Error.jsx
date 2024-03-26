import {useRouteError} from "react-router-dom";

export default function Error() {
    const error = useRouteError();
    return (
        <div className={"container h-dvh flex justify-center items-center"}>
            <div className={"text-center"}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {error.status} {error.statusText || error.message}
                </h1>
            </div>
        </div>
    );
}