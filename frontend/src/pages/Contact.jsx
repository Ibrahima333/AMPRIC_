import { useEffect, useState } from "react";
import { apiFetch, ensureCsrf } from "../api/client";
import FlashBanner from "../components/FlashBanner";
import Reveal from "../components/Reveal";
import "../styles/contact.css";

export default function Contact() {
  const [fields, setFields] = useState({ nom: "", email: "", message: "" });
  const [flash, setFlash] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureCsrf();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const data = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(fields),
      });
      setFlash({ category: data.category, message: data.message });
      setFields({ nom: "", email: "", message: "" });
    } catch (error) {
      setFlash({ category: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-fluid contact">
        <div className="overlay_contact">
          <div className="content_contact">
            <h1>Contact</h1>
            <p>
              Vous avez une question, besoin d'information, d'écoute ou d'orientation concernant la polyarthrite
              rhumatoïde ou les rhumatismes inflammatoires chroniques ?
              L'équipe de l'AMPRIC est à votre disposition pour vous répondre et vous accompagner.
            </p>
          </div>
        </div>
      </div>

      <FlashBanner category={flash?.category} message={flash?.message} onDone={() => setFlash(null)} />

      <Reveal as="div" className="container contact_form">
        <h1>contactez-nous :</h1>
        <p>Des questions ou des commentaires ? Ecrivez-nous simplement un message</p>
        <form onSubmit={handleSubmit} className="contact_form">
          <input type="text" name="nom" placeholder="Votre nom" value={fields.nom} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Votre email" value={fields.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Votre message" rows="5" value={fields.message} onChange={handleChange} required />
          <button type="submit" disabled={submitting}>Envoyer</button>
        </form>
      </Reveal>

      <div className="container-fluid contact_info">
        <Reveal as="div" className="carte">
          <div className="carte_info">
            <h2>Notre adresse</h2>
            <p>Niamana attbougou, Bamako, Mali</p>
          </div>
          <div className="carte_icone">
            <img src="/image/icon_adress.png" alt="Icône adresse" width="100" height="100" loading="lazy" decoding="async" />
          </div>
        </Reveal>

        <Reveal as="div" className="carte" delay={100}>
          <div className="carte_info">
            <h2>Numéro de téléphone</h2>
            <p>+223 782306178</p>
          </div>
          <div className="carte_icone">
            <img src="/image/icon_phone.png" alt="Icône téléphone" width="100" height="100" loading="lazy" decoding="async" />
          </div>
        </Reveal>

        <Reveal as="div" className="carte carte_email" delay={200}>
          <div className="carte_info">
            <h2>Notre email</h2>
            <p>contact@ampric.com</p>
          </div>
          <div className="carte_icon">
            <img src="/image/icon_email.png" alt="Icône email" width="100" height="100" loading="lazy" decoding="async" />
          </div>
        </Reveal>
      </div>
    </>
  );
}
