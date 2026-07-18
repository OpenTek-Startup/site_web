/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./form.css";

export const FormComponent = ({ initialData = {}, onSubmit, fields, submitLabel }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          {field.type !== "bool" && <label>{field.label}</label>}

          {field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une option</option>
              {field.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={handleChange}
              rows={field.rows || 5}
            />
          ) : field.type === "bool" ? (
            <label className="form-checkbox">
              <input
                type="checkbox"
                name={field.name}
                checked={!!formData[field.name]}
                onChange={handleChange}
              />
              {field.label}
            </label>
          ) : field.type === "file" ? (
            <input
              type="file"
              name={field.name}
              accept={field.accept || "image/*"}
              onChange={handleChange}
            />
          ) : (
            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              name={field.name}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button type="submit">{submitLabel}</button>
    </form>
  );
};
