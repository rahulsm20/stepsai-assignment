import { LogInIcon } from "lucide-react";
import { Button } from "../components/ui/button";

const Landing = () => {
  const Login = () => {
    location.replace("/login");
  };
  const Signup = () => {
    location.replace("/signup");
  };
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <h1 className="p-5 text-2xl">Patient Dashboard and Chatbot</h1>
      <div className="flex gap-5">
        <Button
          className="flex gap-1 items-center justify-center"
          onClick={() => Login()}
        >
          <p>Login</p>
          <LogInIcon size={15} />
        </Button>
        <Button
          className="flex gap-1 items-center justify-center"
          onClick={() => Signup()}
        >
          <p>Signup</p>
          <LogInIcon size={15} />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
