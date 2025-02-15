"use server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { getIp } from "@/lib/getIp";
import { rateLimiter } from "@/lib/rateLimiter";


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY as string,
});

export async function POST(req: NextRequest) {
  try {
    // Run the rate limiter middleware
    const clientIp = getIp(req);
    const r = await rateLimiter(clientIp);
    if (!r.success){
      return NextResponse.json({ error: "Too many requests" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Too many requests" }, { status: 400 });
  }

  try {
    // Parse JSON body expecting: name, email, message, and a honeypot field 'hp'
    const { name, email, message, hp } = await req.json();

    // Honeypot check: if 'hp' is filled, it's likely a bot
    if (hp && hp.trim() !== "") {
      return NextResponse.json({ error: "Request not allowed." }, { status: 400 });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Construct the email data
    const data = {
      from: `${process.env.CONTACT_FROM_NAME} <${process.env.CONTACT_FROM_EMAIL}>`,
      to: process.env.CONTACT_TO_EMAIL,
      subject: "New Contact Form Submission From My Website",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    // Send the email via Mailgun
    const response = await mg.messages.create(
      process.env.MAILGUN_DOMAIN as string,
      data
    );
    if (!response.id){
      console.error("Mailgun response:", response);
      return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error sending email with Mailgun:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
