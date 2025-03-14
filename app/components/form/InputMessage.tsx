import { Mic, Send, Video } from "lucide-react"

export default function InputMessage() {
    return (
        <div className=" p-2 mt-4 rounded-xl bg-slate-800">
            <textarea defaultValue={"Entrez votre message"} name="" id="" className=" h-20 w-full bg-transparent border-none active:border-none hover:border-none focus-within:border-none focus-visible:border-none focus:border-none">
            
            </textarea>
            <div className=" flex justify-between">
                <div className=" flex gap-2">
                    <button className="btn bg-blue-900 rounded-full border-none text-white"><Mic></Mic></button>
                    <button className="btn bg-blue-900 rounded-full border-none text-white"><Video></Video></button>
                </div>
                <button className="btn flex bg-blue-900 rounded-full justify-center items-center border-none text-white">envoyer <Send></Send></button>
            </div>
        </div>
    )
}