import { RotateCw } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addInteraction, addUpdateDoctorInformation, getUser } from "../api";
import { RootState } from "../App";
import ChatbotWidget from "../components/ChatbotWidget";
import { DataTable } from "../components/DataTable";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { setUser } from "../store/authSlice";
const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      query: "",
      response: "",
      name: "",
      phoneNumber: "",
      interactionDate: "",
    },
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addingInteraction, setAddingInteraction] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const profileData = useSelector((state: RootState) => state.auth.user);

  const submitForm = async (data: FieldValues) => {
    const { name, phoneNumber } = data;
    await addUpdateDoctorInformation({ name, phoneNumber });
    const profile = await getUser();
    dispatch(setUser(profile));
  };
  const submitInteraction = async (data: FieldValues) => {
    try {
      setLoading(true);
      setAddingInteraction(true);
      setModalOpen(false);
      const { query, response } = data;
      await addInteraction({ query, response });
      const profile = await getUser();
      reset();
      dispatch(setUser(profile));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setAddingInteraction(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="flex justify-center m-20 mt-10 items-center">
        <div className="flex flex-col gap-10">
          <div className="flex rounded-xl border">
            <div className="flex flex-col px-5 m-5 gap-5">
              <div className="flex items-center justify-center gap-5">
                <div className="flex flex-col gap-2">
                  <p className="flex">User Info</p>
                  <hr />
                  <div>
                    <p className="flex gap-2">
                      <span className="font-semibold">First Name:</span>
                      <span>{user.firstName}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-semibold">Last Name:</span>
                      <span>{user.lastName}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-semibold">Username:</span>
                      <span>{user.username}</span>
                    </p>
                  </div>
                </div>
              </div>
              {!profileData.doctor ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Doctor</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form
                      onSubmit={handleSubmit(submitForm)}
                      className="grid gap-4 py-4"
                    >
                      <DialogHeader>
                        <DialogTitle>Add Doctor</DialogTitle>
                        <DialogDescription>
                          Make changes to your doctor's details here. Click save
                          when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3"
                            {...register("name")}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            type="number"
                            className="col-span-3"
                            {...register("phoneNumber")}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="flex mb-2">Doctor's details</p>
                    <hr />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="flex gap-2">
                      <span className="font-semibold">Name:</span>
                      <span>{profileData.doctor.name}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-semibold">Phone Number:</span>
                      <span>{profileData.doctor.phoneNumber}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {profileData?.doctor && (
        <div className="flex justify-center m-20 items-center  flex-col gap-4">
          <p> Interactions</p>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Interaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-80">
              <form
                onSubmit={handleSubmit(submitInteraction)}
                className="grid gap-4 py-4"
              >
                <DialogHeader>
                  <DialogTitle>Add Interaction</DialogTitle>
                  <DialogDescription>
                    Log a new interaction. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="query" className="text-right">
                      Query
                    </Label>
                    <Textarea
                      id="query"
                      className="col-span-3"
                      placeholder="Enter query"
                      required
                      {...register("query")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="response" className="text-right">
                      Response
                    </Label>
                    <Textarea
                      id="response"
                      placeholder="Enter response"
                      className="col-span-3"
                      required
                      {...register("response")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? <RotateCw className="animate-spin" /> : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {addingInteraction ? (
            <div className=" flex items-center justify-center">
              <RotateCw className="animate-spin" />
            </div>
          ) : (
            profileData?.id && <DataTable data={profileData.interactions} />
          )}
        </div>
      )}
      <ChatbotWidget />
    </div>
  );
};

export default Profile;
