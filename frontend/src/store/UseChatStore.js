import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
   try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  const socket = useAuthStore.getState().socket;

  try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

    const newMessage = res.data;

    set({ messages: [...messages, newMessage] });

    socket.emit("send message", {
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      text: newMessage.text,
      image: newMessage.image,
    });
  } catch (error) {
    toast.error(error.response.data.message);
  }
},


  subscribeToMessages: () => {
  const socket = useAuthStore.getState().socket;
  const { selectedUser } = get();
  if (!socket || !selectedUser) return;

  socket.off("message received");

  socket.on("message received", (newMessage) => {
    const senderId = newMessage.senderId?._id || newMessage.senderId;
    const receiverId = newMessage.receiverId?._id || newMessage.receiverId;
    const selectedUserId = selectedUser._id;

    const isRelevant =
      senderId === selectedUserId || receiverId === selectedUserId;

    if (!isRelevant) return;

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  });
},


  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("message received");
  },


  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

