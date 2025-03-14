import CenterLayout from "./components/ui/CenterLayout";
import RightBar from "./components/ui/rightBar";
import SideBar from "./components/ui/SideBar";

const index = () => {
  return (
    <div className=" absolute  flex h-full w-full">
     <SideBar></SideBar>
     <CenterLayout></CenterLayout>
     <RightBar/>
    </div>
  );
};

export default index;
