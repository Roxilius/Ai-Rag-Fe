import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
const App: React.FC = () => {
  return (
    <>
      <Outlet/>
      <Toaster position="top-left" reverseOrder={false}  />
    </>
  );
};

export default App
