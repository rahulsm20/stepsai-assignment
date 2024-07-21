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
import axios from "axios";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  const dispatch = useDispatch();
  const submitForm = async (data: FieldValues) => {
    setLoading(true);
    try {
      const user = await api.post("/auth/signup", data);
      if (user) {
        dispatch(setUser(user.data));
      }
      location.replace("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(String(err.response.data));
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-[350px] text-start">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create your account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitForm)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                required
                {...register("firstName")}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                required
                {...register("lastName")}
              />
            </div>
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
        <CardFooter className="flex flex-col text-start justify-between gap-2">
          <Button
            className="self-start flex gap-1"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Processing</span>
                <RotateCw className="animate-spin w-4" />
              </>
            ) : (
              <>Signup</>
            )}
          </Button>
          <span className="flex gap-1">
            Already have an account?
            <Link to="/login" className="text-[#6c67ff]">
              Login here
            </Link>
          </span>
          {error && <p className="text-red-600">{error}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}
