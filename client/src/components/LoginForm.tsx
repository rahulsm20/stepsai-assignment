import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { api } from "../api";
import { setUser } from "../store/authSlice";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { RotateCw } from "lucide-react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });
  const dispatch = useDispatch();
  const submitForm = async (data: FieldValues) => {
    setLoading(true);
    try {
      const user = await api.post("/auth/login", data);
      if (user.data) {
        dispatch(setUser(user.data));
      }
      location.replace("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-[350px] text-start">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log into your account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitForm)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
                {...register("username")}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                {...register("password")}
              />
            </div>
          </div>
        </CardContent>
        {loading ? (
          <div>
            <RotateCw className="animate-spin" />
          </div>
        ) : (
          <CardFooter className="flex flex-col text-start justify-between gap-2">
            <Button className="self-start" type="submit">
              Login
            </Button>
            <span>
              Don't have an account? <Link to="/signup">Signup here</Link>
            </span>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
