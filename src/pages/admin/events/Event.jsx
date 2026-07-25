import  { useEffect, useState } from 'react'
import { createDocument, deleteDocument, getDocuments, updateDocument } from '../../../services/crudServices';
import { DATABASE_ID, EVENTS_COLLECTION_ID, } from '../../../config/appwrite';
import { ReusableTable } from '../../../components/ReusableComponents/ReusableTable';
import { ReusableModal } from '../../../components/ReusableComponents/reusableModal';
import { ReusableForm } from '../../../components/ReusableComponents/ReusableForm';
import './event.css'

export const Event = () => {

    const [data, setData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editItem, setEditItem] = useState(null)

    const event_fields = [
        {label:'TITLE', name: 'title', placeholder: 'Title' ,type: 'text' },
        {label:'DESCRIPTION', name: 'description', placeholder: 'Description', type: 'text' },
        {label:'DATE', name: 'date', placeholder:'Date', type: 'date' },
        {label:'IMAGE',  name: 'image', placeholder:'image', type: 'text' }

    ]

    const  columns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Description', accessor: 'description' },
        { header: 'Date', accessor: 'date' },
        { header: 'Image', accessor: 'image' }
    ]

    const fetchEvents = async()=>{
        try {
            const events = await getDocuments(DATABASE_ID, EVENTS_COLLECTION_ID )
            setData(events)
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const cleanData = (data) =>{
        return  Object.fromEntries(
            Object.entries(data).filter(([key])=>!key.startsWith('$'))
        )
    }
    const handleCreateOrUpdateJob = async(data)=>{
        try {
            const cleanedData = cleanData(data)
            if(editItem){
                await updateDocument(DATABASE_ID, EVENTS_COLLECTION_ID, editItem.$id, cleanedData, [])
            }
            else{
                await createDocument(DATABASE_ID, EVENTS_COLLECTION_ID, cleanedData)
            }
            fetchEvents();
            setModalIsOpen(false);
            setEditItem(null);
        }
            
         catch (error) {
           console.error('Erreur lors de la creation/mise a jour de l\'evenement:', error)
           alert("Une erreur est survenue lors de l'enregistrement de l'evenement.")
        }}


    const handleEdit = (item) =>{
        setEditItem(item)
        setModalIsOpen(true)
    }

    const handleDelete = async(eventId) =>{
        if (!window.confirm("Supprimer definitivement cet evenement ?")) return;
        try {
            await deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId)
            fetchEvents()
        } catch (error) {
            console.error('Error deleting event:', error)
            alert("Une erreur est survenue lors de la suppression de l'evenement.")
        }
    }

  return (
    <div className='event'>
        <button onClick={()=>setModalIsOpen(true)} className='xbtn'>New event</button>
        <ReusableTable data={data} columns={columns} onDelete={handleDelete} onEdit={handleEdit}/>
        {
            modalIsOpen && (

            <ReusableModal onClose={()=>setModalIsOpen(false)}>
                <ReusableForm
                fields={event_fields}
                onSubmit={handleCreateOrUpdateJob}
                initialData={editItem || {}}
                submitLabel='Apply'
                 />
            </ReusableModal>
            )
        }
    </div>
  )
}
