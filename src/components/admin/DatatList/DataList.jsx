/* eslint-disable react/prop-types */

import { useState } from "react";
import "./datalist.css";

export const DataList = ({ columns, data, onEdite, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleMoreDetails = (item) => {
      setSelectedItem(item);
    };
  
    const closeModal = () => {
      setSelectedItem(null);
    };
  
    return (
        <div>
          {data && data.length > 0 ? (
            <div className="data-table__wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.accessor}>{col.header}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, rowIndex) => (
                    <tr key={item.$id || rowIndex}>
                      {columns.map((col) => (
                        <td key={col.accessor}>
                          {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                        </td>
                      ))}
                      <td className="data-table__actions">
                          <button className="btn edit-btn" onClick={() => onEdite && onEdite(item)}>Éditer</button>
                          <button className="btn delete-btn" onClick={() => onDelete && onDelete(item.$id, item)}>Supprimer</button>
                          <button className="btn details-btn" onClick={() => handleMoreDetails(item)}>Plus de détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucune donnée disponible</p>
          )}
    
          {selectedItem && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Détails</h3>
                {columns.map((col, index) => (
                  <p key={index}>
                    <strong>{col.header}:</strong>{" "}
                    {col.render ? col.render(selectedItem[col.accessor], selectedItem) : selectedItem[col.accessor]}
                  </p>
                ))}
                <button className="btn delete-btn" onClick={closeModal}>Fermer</button>
              </div>
            </div>
          )}
        </div>
      );
}
