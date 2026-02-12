import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import Graph from "./components/RightPanel/Graph";
import Login from "./components/Login/Login";
import Landing from "./components/Landing/Landing";

import useToken from "./hooks/useToken";

const App = () => {
  const { token, clicked, setToken } = useToken();

  if (
    import.meta.env.VITE_PAGE_KEY &&
    token !== import.meta.env.VITE_PAGE_KEY
  ) {
    return <Login setToken={setToken} clicked={clicked} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/viz"
          element={
            <Layout leftContent={<LeftPanel />} rightContent={<Graph />} />
          }
        />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
