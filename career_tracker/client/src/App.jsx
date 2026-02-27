import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Layout from "./components/Layout";
import DsaTracker from "./pages/DsaTracker";
import Interviews from "./pages/Interviews";
import Resumes from "./pages/Resumes";
import Profile from "./pages/Profile";
// import InterviewSimulator from "./pages/InterviewSimulator";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/interview-simulator" element={<InterviewSimulator />} /> */}


        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
  path="/interviews"
  element={
    <Layout>
      <Interviews />
    </Layout>
  }
/>

<Route
  path="/profile"
  element={
    <Layout>
      <Profile />
    </Layout>
  }
/>


<Route
  path="/resumes"
  element={
    <Layout>
      <Resumes />
    </Layout>
  }
/>


        <Route
          path="/applications"
          element={
            <Layout>
              <Applications />
            </Layout>
          }
        />
        <Route
  path="/dsa"
  element={
    <Layout>
      <DsaTracker />
    </Layout>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
