import { ScreenShare } from "lucide-react"
import Image from "next/image"
import ListeInvites from "./ListeInvite"
import InviteCard from "./Invitecard"

export default function RightBar() {
    return (
        <div className=" bg-slate-900 relative w-1/2 h-full flex flex-col p-5">
            <h1 className=" text-2xl text-white font-bold">Invités (56)</h1>
            <div className=" my-2">
                <ListeInvites></ListeInvites>
            </div>
            <ScreenListe></ScreenListe>
            <button className="bg-blue-900 absolute btn  w-80 mb-2  bottom-0 border-none text-white rounded-xl"><ScreenShare></ScreenShare>  Partager son editeur</button>
        </div>
    )
}

function ScreenListe() {
    return (
        <div className="p-2 flex flex-col gap-5 overflow-y-scroll h-96">
            <Screencard IsCurrent></Screencard>
            <Screencard IsCurrent={false} wantShare={true}></Screencard>
            <Screencard></Screencard>
            <Screencard></Screencard>
            <Screencard></Screencard>
        </div>
    )
}

function Screencard({ IsCurrent = false, wantShare = false }: { IsCurrent?: boolean, wantShare?: boolean }) {
    return (
        <div className={" flex flex-col rounded-xl p-5   " + (IsCurrent ? " bg-blue-950 scale-105 " :  (wantShare ? "  bg-slate-950 border border-blue-900 animate-pulse" : "bg-slate-950"))}>
            <div className=" flex justify-center items-center">
                <InviteCard asName={false}></InviteCard>
            </div>
            {IsCurrent && <p className=" text-center text-white font-bold animate-pulse text-sm ">Chadrak est en cours...</p>}
            {wantShare && <p className=" text-center text-white animate-pulse text-xs ">Chadrak a partagé son éditeur</p>}
        </div>
    )
}