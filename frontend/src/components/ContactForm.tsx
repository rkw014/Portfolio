"use client";
import axios from "axios";
import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot field – this should remain empty for legitimate users
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await axios.post("/contact", 
        { name, email, message, hp }, 
        );

      if (res.status == 200) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setHp("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">Name</label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block mb-1 font-medium">Message</label>
        <textarea
          id="message"
          rows={4}
          className="w-full border border-gray-300 rounded p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      {/* Honeypot field: This hidden field should remain empty */}
      <div className="hidden">
        <label htmlFor="confirmEmail" className="block mb-1 font-medium">Confirm Email</label>
        <input
          id="confirmEmail"
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-row justify-start items-center gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>

        {status === "success" && (
          <p className="text-green-600 leading-normal">Message sent successfully!<br/>Thank you for your interest!</p>
        )}
        {status === "error" && (
          <p className="text-red-600">Oops, something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}
