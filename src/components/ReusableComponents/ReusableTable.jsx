import './component.css'
/* eslint-disable react/prop-types */

export const ReusableTable = ({data, columns, onDelete, onEdit}) => {
  return (
    <div>
        {data && data.length > 0 ? (
    <div className="data-table__wrapper">
    <table className="data-table">
        <thead>
            <tr>
                {
                    columns.map((column)=>
                        <th key={column.accessor}> {column.header} </th>
                    )
                }
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
                {
                    data.map((item, index)=>
                        <tr key={item.$id || index}>
                            {columns.map((col) => (
                      <td key={col.accessor}>
                        {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                      </td>
                    ))}
                            <td className="data-table__actions">
                                <button className="btn edit-btn" onClick={()=>onEdit(item)}>Editer</button>
                                <button className="btn delete-btn" onClick={()=>onDelete(item.$id)}>Supprimer</button>
                            </td>
                        </tr>
                    )
                }
        </tbody>
    </table>
    </div>
        ):(
            <p>Aucun evenement pour le moment</p>
        )
    }
 </div>

  )
}
