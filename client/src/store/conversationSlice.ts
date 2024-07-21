import { createSlice } from "@reduxjs/toolkit";

export type MessageType = {
  id: number;
  content: string;
  isResponse: boolean;
};

type MessageState = {
  messages: MessageType[];
};

export type ConversationState = {
  id: number;
  title: string;
  messages: MessageState[];
};
const initialState: MessageState = {
  messages: [],
};

const conversationSlice = createSlice({
  name: "conversationData",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const newMessage = action.payload;
      state.messages = [...state.messages, newMessage];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, setMessages } = conversationSlice.actions;
export default conversationSlice.reducer;
