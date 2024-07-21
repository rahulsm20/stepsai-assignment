import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { getUser } from "./api";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import { setUser } from "./store/authSlice";
import { MessageType } from "./store/conversationSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export type InteractionType = {
  id: number;
  title: string;
  interactionDate: string;
  patientId: string;
  doctorId: string;
  query: string;
  response: string;
};
export type RootState = {
  auth: {
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      doctor: {
        id: number;
        name: string;
        phoneNumber: string;
      };
      interactions: InteractionType[];
      messages: MessageType[];
    };
    profileData: {
      id: string;
      name: string;
      doctor: {
        id: number;
        name: string;
        phoneNumber: string;
      };
      interactions: InteractionType[];
      messages: MessageType[];
    };
  };
};

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getUser()
      .then((data) => dispatch(setUser(data)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RotateCw className="animate-spin" />
      </div>
    );
  }
  console.log("user: ", user);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </ThemeProvider>
  );
}

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="*" element={<Profile />} />
  </Routes>
);

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Landing />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default App;
