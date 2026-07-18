import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonPrimary } from "../../commons/Button";
import "./contact.css";
import contactHeroImage from "../../assets/images/contact_5.png";
import AOS from "aos";
import { createDocument } from "../../services/crudServices";
import { DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID } from "../../config/appwrite";
import { Seo } from "../../components/seo/Seo";

const Contact = () => {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState(""); // honeypot anti-spam (champ invisible)
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		AOS.init({ duration: 1000 });
	}, []);

	function setIsSuccessFalse() {
		setIsSuccess(false);
		setName("");
		setEmail("");
		setMessage("");
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		setError("");

		// Honeypot : un bot remplira ce champ cache, un humain ne le verra jamais
		if (website) {
			return;
		}

		if (!name || !email || !message) {
			setError(t("contactPage.errorRequired"));
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError(t("contactPage.errorEmail"));
			return;
		}

		setLoading(true);
		try {
			await createDocument(DATABASE_ID, CONTACT_MESSAGES_COLLECTION_ID, {
				name: name.slice(0, 150),
				email: email.slice(0, 150),
				message: message.slice(0, 2000),
				read: false,
			});
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccessFalse();
			}, 4500);
		} catch (err) {
			console.error("Erreur lors de l'envoi du message:", err);
			setError(t("contactPage.errorGeneric"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="contact-page">
				<Seo
					title="Contact"
					description="Contactez OpenTek pour discuter de votre projet web, mobile, ERP ou IA."
					path="/contact"
				/>
				<div className="contact-header" data-aos="fade-up">
					<h1>{t("contactPage.title")}</h1>
					<p>{t("contactPage.subtitle")}</p>
				</div>

				<div className="contact-section-main">
					<div className="contact-section-hero-image">
						<img src={contactHeroImage} alt="loading..." />
					</div>
					<div className="contact-form-wrapper" data-aos="zoom-in">
						{isSuccess ? (
							<div className="contact-form-success">
								<p>{t("contactPage.success")}</p>
							</div>
						) : (
							<form onSubmit={onSubmit}>
								{error && <p className="contact-form-error">{error}</p>}
								{/* Honeypot anti-spam : invisible pour un humain, souvent rempli par les bots */}
								<input
									type="text"
									name="website"
									value={website}
									onChange={(e) => setWebsite(e.target.value)}
									autoComplete="off"
									tabIndex={-1}
									style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
									aria-hidden="true"
								/>
								<div className="form-group">
									<label htmlFor="name">{t("contactPage.name")}</label>
									<input
										type="text"
										name="name"
										placeholder={t("contactPage.namePlaceholder")}
										value={name}
										maxLength={150}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="email">{t("contactPage.email")}</label>
									<input
										type="email"
										name="email"
										placeholder={t("contactPage.emailPlaceholder")}
										value={email}
										maxLength={150}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="message">{t("contactPage.message")}</label>
									<textarea
										name="message"
										placeholder={t("contactPage.messagePlaceholder")}
										value={message}
										maxLength={2000}
										onChange={(e) => setMessage(e.target.value)}
									/>
								</div>
								<ButtonPrimary
									title={loading ? t("contactPage.sending") : t("contactPage.submit")}
									disabled={loading}
								/>
							</form>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Contact;
