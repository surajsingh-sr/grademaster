// import { useState, type FormEvent } from "react";
// import { Mail, MessageSquare, Send } from "lucide-react";
// import { Button } from "@/components/Button";
// import { FloatingInput } from "@/components/FormFields";
// import { useToast } from "@/components/Toast";
// import emailjs from "@emailjs/browser";

// export function ContactPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const { showToast } = useToast();

//  async function handleSubmit(e: FormEvent) {
//   e.preventDefault();

//   if (!name || !email || !message) {
//     showToast("Please fill in all fields.", "error");
//     return;
//   }

//   try {
//     await emailjs.send(
//       "service_lkokirf",
//       "template_hsii3ak",
//       {
//         to_email: "www.infinitymovies@gmail.com",
//         from_name: name,
//         from_email: email,
//         message: message,
//       },
//        "C8STvQuP78Yeu_qpx",
//     );

//     showToast("Message sent successfully!", "success");

//     setName("");
//     setEmail("");
//     setMessage("");
//   } catch (error) {
//     console.error(error);
//     showToast("Failed to send message.", "error");
//   }
// }
//   return (
//     <div className="container section" style={{ maxWidth: 620 }}>
//       <h1 className="section-title" style={{ textAlign: "left" }}>
//         Get in <span className="gradient-text">Touch</span>
//       </h1>
//       <p className="text-muted mt-8">Have a question, feature request, or found a bug? We'd love to hear from you.</p>

//       <div className="card mt-24">
//         <form onSubmit={handleSubmit} className="flex" style={{ flexDirection: "column", gap: 18 }}>
//           <div className="dynamic-row-fields cols-2">
//             <FloatingInput label="Your name" value={name} onChange={(e) => setName(e.target.value)} />
//             <FloatingInput label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           </div>
//           <div className="field">
//             <textarea placeholder=" " rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
//             <label style={{ top: 12 }}>Your message</label>
//           </div>
//           <Button block type="submit">
//             <Send size={16} /> Send message
//           </Button>
//         </form>
//       </div>

//       <div className="flex mt-24" style={{ gap: 24, flexWrap: "wrap" }}>
//         <div className="flex items-center gap-8 text-muted" style={{ fontSize: "0.85rem" }}>
//           <Mail size={16} /> support@grademaster.app
//         </div>
//         <div className="flex items-center gap-8 text-muted" style={{ fontSize: "0.85rem" }}>
//           <MessageSquare size={16} /> Live chat available 9am–6pm IST
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState, type FormEvent } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/Button";
import { FloatingInput } from "@/components/FormFields";
import { useToast } from "@/components/Toast";
import emailjs from "@emailjs/browser";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { showToast } = useToast();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    try {
      await emailjs.send(
        "service_lkokirf",
        "template_clq7zwp",
        {
          name: name,
          email: email,
          message: message,
        },
        {
          publicKey: "C8STvQuP78Yeu_qpx",
        }
      );

      showToast("Message sent successfully!", "success");

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("Failed to send message.", "error");
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 620 }}>
      <h1 className="section-title" style={{ textAlign: "left" }}>
        Get in Touch
      </h1>

      <p>
        Have a question, feature request, or found a bug? We'd love to hear
        from you.
      </p>

      <div className="card mt-24">
        <form
          onSubmit={handleSubmit}
          className="flex"
          style={{
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div className="dynamic-row-fields cols-2">
            <FloatingInput
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FloatingInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <textarea
              placeholder=" "
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <label style={{ top: 12 }}>
              Your message
            </label>
          </div>

          <Button block type="submit">
            <Send size={16} /> Send message
          </Button>
        </form>
      </div>

      <div
        className="flex mt-24"
        style={{
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          className="flex items-center gap-8 text-muted"
          style={{ fontSize: "0.85rem" }}
        >
          <Mail size={16} /> support@grademaster.com
        </div>

        <div
          className="flex items-center gap-8 text-muted"
          style={{ fontSize: "0.85rem" }}
        >
          <MessageSquare size={16} /> Live chat available 9am–6pm IST
        </div>
      </div>
    </div>
  );
}


