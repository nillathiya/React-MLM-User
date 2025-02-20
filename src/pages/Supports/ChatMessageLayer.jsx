import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";
import "./support.css";

const API_URL = "http://192.168.29.191:5000";
const socket = io(API_URL, { transports: ["websocket", "polling"] });
const ChatMessageLayer = () => {
  const userId = "67a1ed47bdb1df00ca4dab9c";

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unreadTickets, setUnreadTickets] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("open");
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    fetchTickets();
    socket.emit("register", userId);

    socket.on("newMessage", (data) => {
      console.log("New message from admin:", data);
      if (selectedTicket && selectedTicket._id === data.ticketId) {
        setMessages((prev) => [...prev, data]);
        if (data.sender === "user") {
          console.log("seen request send by user");
          socket.emit("seenRequest", {
            ticketId: data.ticketId,
            sender: data.sender,
          });
        }
      } else {
        setUnreadTickets((prev) => {
          const updated = new Set(prev);
          updated.add(data.ticketId);
          return updated;
        });
      }
    });

    socket.on("messagesRead", ({ ticketId }) => {
      console.log("Messages read by user:", ticketId);
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      }
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === ticketId
            ? {
                ...t,
                unreadMessages: { admin: 0 },
              }
            : t
        )
      );
    });

    socket.on("seenRequest", ({ ticketId }) => {
      console.log("seen request listen by user on ticket", ticketId);
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({
            ...msg,
            isRead: true,
          }))
        );

        socket.emit("seen", { ticketId, sender: "user" });
      }
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === ticketId
            ? {
                ...t,
                unreadMessages: { admin: 0 },
              }
            : t
        )
      );
    });
    socket.on("seen", ({ ticketId }) => {
      console.log("User listen seen triggred by admin");
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      }
      setUnreadTickets((prev) => {
        const updated = new Set(prev);
        updated.delete(ticketId);
        return updated;
      });
      console.log("✅ User marked ticket as seen:", ticketId);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("seenRequest");
      socket.off("seen");
    };
  }, [userId, selectedTicket, messages]);

  const fetchTickets = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/tickets/user/${userId}`
      );
      const fetchedTickets = response.data.tickets;

      setTickets(fetchedTickets);
      const unreadSet = new Set();
      fetchedTickets.forEach((ticket) => {
        if (ticket.unreadMessages?.user > 0) {
          unreadSet.add(ticket._id);
        }
      });

      setUnreadTickets(unreadSet);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // fetch perticular tickets messages
  const fetchMessages = async (ticket) => {
    try {
      // Set the selected ticket
      setSelectedTicket(ticket);
      // Remove the unread status from UI
      setUnreadTickets((prev) => {
        const updated = new Set(prev);
        updated.delete(ticket._id);
        return updated;
      });

      // Mark messages as read in backend
      await axios.post(`${API_URL}/api/tickets/mark-read`, {
        ticketId: ticket._id,
        userId,
      });
      // Fetch latest messages from the backend
      const response = await axios.post(
        `${API_URL}/api/tickets/${ticket._id}/messages`
      );
      console.log("++++++", response);

      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        console.error("Failed to fetch messages:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedTicket) return;

    try {
      await axios.post(`${API_URL}/api/tickets/message/send`, {
        ticketId: selectedTicket._id,
        text: input,
        sender: "user",
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/tickets/create`, {
        userId,
        title,
        description,
      });
      setTickets((prev) => [...prev, response.data.ticket]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleFilterChanges = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    fetchTickets();
  };

  // Update Ticket Status
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.post(`${API_URL}/api/tickets/status/${ticketId}`, {
        status: newStatus,
      });
      fetchTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  console.log("User tickets", tickets);

  return (
    <>
      <div className="create_new_ticket_section">
        {/* Ticket Creation Form */}
        <div className="create_filter_ticket">
          <h3>Create a Ticket</h3>
        </div>
        <div className="create_input_section mt-4">
          <form onSubmit={createTicket}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button type="submit" className="createButton">
              Create Ticket
            </button>
          </form>
        </div>
      </div>

      <div className="chat-wrapper mt-5">
        <div
          className="chat-sidebar card"
          style={{ boxShadow: "7px 7px 21px rgba(0, 0, 0, 0.6)" }}
        >
          <div className="chat-sidebar-single active top-profile">
            <div className="img">
              <img src="assets/images/chat/1.png" alt="image_icon" />
            </div>
            <div className="info">
              {selectedTicket && (
                <>
                  <h6 className="text-md mb-0">{selectedTicket.title}</h6>
                  <p className="mb-0">{selectedTicket.status}</p>
                </>
              )}
            </div>
            <div className="action">
              <div className="btn-group">
                <button
                  type="button"
                  className="text-secondary-light text-xl"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                  aria-expanded="false"
                >
                  <Icon icon="bi:three-dots" />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-lg-end border"
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleFilterChanges}
                >
                  <li value="open">Open</li>
                  <li value="completed">Completed</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="chat-search">
            <span className="icon">
              <Icon icon="iconoir:search" />
            </span>
            <input
              type="text"
              name="#0"
              autoComplete="off"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="chat-all-list">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className={`chat-sidebar-single ${
                  selectedTicket?._id === ticket._id ? "active" : ""
                }`}
                onClick={() => fetchMessages(ticket)}
              >
                <div className="img">
                  <img src="assets/images/chat/2.png" alt="image_icon" />
                </div>
                <div className="info">
                  <h6 className="text-sm mb-1">{ticket.title}</h6>
                  {/* <p className="mb-0 text-xs">{ticket.description}</p> */}
                </div>
                <div className="action text-end">
                  <p className="mb-0 text-neutral-400 text-xs lh-1">Now</p>
                  {unreadTickets.has(ticket._id) && (
                    <span className="w-16-px h-16-px text-xs rounded-circle bg-warning-main text-white d-inline-flex align-items-center justify-content-center">
                      !
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="chat-main card"
          style={{ boxShadow: "7px 7px 21px rgba(0, 0, 0, 0.6)" }}
        >
          {selectedTicket && (
            <>
              <div className="chat-sidebar-single active">
                <div className="img">
                  <img src="assets/images/chat/11.png" alt="image_icon" />
                </div>
                <div className="info">
                  <h6 className="text-md mb-0">{`#${selectedTicket._id} (${selectedTicket.title})`}</h6>
                  <p className="mb-0">{selectedTicket.status}</p>
                </div>
                <div className="action d-inline-flex align-items-center gap-3">
                  <button type="button" className="text-xl text-primary-light">
                    <Icon icon="mi:call" />
                  </button>
                  <button type="button" className="text-xl text-primary-light">
                    <Icon icon="fluent:video-32-regular" />
                  </button>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="text-primary-light text-xl"
                      data-bs-toggle="dropdown"
                      data-bs-display="static"
                      aria-expanded="false"
                    >
                      <Icon icon="tabler:dots-vertical" />
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-lg-end border"
                      value={statusFilter}
                      onChange={handleFilterChanges}
                    >
                      <li>
                        <button
                          className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2"
                          type="button"
                          value="open"
                        >
                          <Icon icon="mdi:clear-circle-outline" />
                          open
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2"
                          type="button"
                          value="completed"
                        >
                          <Icon icon="ic:baseline-block" />
                          completed
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="chat-message-list">
                {/* <div className="chat_messages max-h-60 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                  
                </div> */}
                {messages.map((msg, index) => (
                  <p
                    key={index}
                    className={`p-2 rounded-lg mb-2 ${
                      msg.sender === "user"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 d-flex justify-content-end"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <strong>{msg.sender}:</strong> {msg.text}
                    <span className="ml-2 text-xs">
                      {msg.isRead ? "✔✔" : "✔"}
                    </span>
                  </p>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-message-box">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  name="chatMessage"
                  placeholder="Write message"
                />
                <div className="chat-message-box-action">
                  {/* <button type="button" className="text-xl">
                    <Icon icon="ph:link" />
                  </button>
                  <button type="button" className="text-xl">
                    <Icon icon="solar:gallery-linear" />
                  </button> */}
                  <button
                    type="submit"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                  >
                    Send
                    <Icon icon="f7:paperplane" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMessageLayer;
