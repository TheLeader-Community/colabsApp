import Image from "next/image";

export default function InviteCard({asName = true}:{asName?:boolean}) {
    return (
        <div>
            <Image className=" rounded-full" src={"/img/etudiant1.jpeg"} alt="" width={50} height={50}></Image>
            {asName && <b className=" text-white text-xs">Chadrack</b>}
        </div>
    )
}