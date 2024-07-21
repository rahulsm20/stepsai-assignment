import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": import.meta.env.VITE_CLIENT_URL,
  },
});

export const getUser = async () => {
  try {
    const res = await api.get(`/user`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const Login = async () => {
  try {
    const res = await api.get(`/profile`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const sendQuery = async ({
  query,
  interactionId,
}: {
  query: string;
  interactionId: number | undefined;
}) => {
  try {
    const res = await api.post("/conversations/generate", {
      query,
      interactionId,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getConversationById = async (id: number) => {
  try {
    console.log("sending id:", id);
    const res = await api.get(`/conversations/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getConversations = async () => {
  try {
    const res = await api.get(`/conversations`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addUpdateDoctorInformation = async ({
  name,
  phoneNumber,
}: {
  name: string;
  phoneNumber: string;
}) => {
  try {
    const res = await api.post(`/user/doctor`, {
      name,
      phoneNumber,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addInteraction = async ({
  query,
  response,
}: {
  query: string;
  response: string;
}) => {
  try {
    const res = await api.post(`/conversations/add`, {
      query,
      response,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getProfile = async () => {
  try {
    const res = await api.get(`/auth/profile`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
