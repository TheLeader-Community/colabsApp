import Image from "next/image";

export default function Message({ Reply }: { Reply?: boolean }) {
    return (
        <div className={"flex gap-2 " + (Reply ? " flex-row-reverse" : "")}>
            <div className={"self-end"}>
                <Image className=" rounded-full" src={"/img/etudiant1.jpeg"} width={50} height={50} alt="" />
            </div>
            <div className=" chat-bubble">
                <h1 className=" font-bold text-slate-300">Chadrack</h1>
                <p className=" text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. At, maiores?
                </p>
            </div>
        </div>
    )
}