/* eslint-disable react/prop-types */
import './component.css'
export const ReusableModal = ({onClose, children}) => {
  return (
    <div className="popup-overlay">
        <div className="popup">
            <button onClick={onClose} className="close-btn">X</button>
            {children}
        </div>
    </div>
  )
}
