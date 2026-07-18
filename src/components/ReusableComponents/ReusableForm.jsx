/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

import './component.css'

export const ReusableForm = ({fields, onSubmit, submitLabel, initialData={}}) => {

    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    },[initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })}

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData)
    }

  return (
    <form onSubmit={handleSubmit} >
       {fields
            .map((field, index) => (
                <div key={index}>
                    <label>{field.label}</label>
                    {field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une option</option>
              {field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
                    <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder} 
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                    />)}
                </div>
            ))
        }
        <button type="submit">{submitLabel}</button>
    </form>
  )
}
