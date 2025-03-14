import InputMessage from "../form/InputMessage";
import ListeMessages from "./ListeMessages";

export default function SideBar() {
  return (
    <div className="  h-full w-[800px] bg-slate-900 p-5 text-slate-200">
      <div id="top-text" className=" mt-2">
        <h1 className="  text-3xl font-bold"><span className="text-blue-500">ColabsApps</span></h1>
        <p className="mt-2 text-slate-300">
          Collaborez en temps réel sur de petit projets en local
        </p>
      </div>
      <ListeMessages></ListeMessages>
      <InputMessage></InputMessage>
    </div>
  );
}
