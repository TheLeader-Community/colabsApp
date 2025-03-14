import Message from "./Message";

export default function ListeMessages() {
    return (
        <div className=" overflow-y-scroll h-80 flex flex-col gap-5  mt-5 p-2">
            <Message />
            <Message Reply />
            <Message />
            <Message />
            <Message />
            <Message />
        </div>
    )
}