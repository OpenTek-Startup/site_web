/* eslint-disable no-unused-vars */

import React, { useEffect } from "react";
import "./coreValues.css";
import AOS from "aos";
import "aos/dist/aos.css"; // Make sure to import the AOS CSS
import { assetRepository } from "../../../../../assets/assetRepository";
import { usePageContent } from "../../../../../i18n/usePageContent";

const CoreValues = () => {
	const intro = usePageContent("core_values_intro");
	const value1 = usePageContent("core_value_1");
	const value2 = usePageContent("core_value_2");

	const coreValuesData = [
		{
			title: value1.field("title", "Customer Centricity"),
			description: value1.field(
				"body",
				"We place our clients at the heart of everything we do, ensuring our solutions are tailored to meet their evolving needs."
			),
		},
		{
			title: value2.field("title", "Satisfaction"),
			description: value2.field(
				"body",
				"We strive to exceed expectations by delivering high-quality products and services that empower our clients to succeed."
			),
		},
	];

	useEffect(() => {
		// Initialize AOS with desired settings
		AOS.init({ duration: 800, once: true });
	}, []);

	return (
		<section className="container core-values-section">
				{/* Main Content: Image & Values List */}
				<div className="core-values-content">
					<div className="core-values-image" data-aos="fade-right">
						{/* Replace this placeholder with a real image */}
						<img src={assetRepository.CoreValues} alt="OpenTek Team" />
					</div>

					<div className="core-values-list" data-aos="fade-left">
						{/* Section Header */}
						<div className="core-values-header" data-aos="fade-up">
							<h2>{intro.field("title", "Why Choose Us !")}</h2>
							<p data-aos="fade-up" data-aos-delay="100">
								{intro.field(
									"body",
									"At OpenTek, we uphold the following values to ensure we consistently deliver excellence for our clients."
								)}
							</p>
						</div>
						{coreValuesData.map((value, index) => (
							<div
								className="core-value-item"
								key={index}
								data-aos="fade-up"
								data-aos-delay={200 + index * 100}
							>
								<h3>{value.title}</h3>
								<p>{value.description}</p>
							</div>
						))}
					</div>
				</div>
		</section>
	);
};

export default CoreValues;
