import { databases, storage, ID, MEDIA_BUCKET_ID, account } from "../config/appwrite";

// Retire les attributs systeme Appwrite ($id, $createdAt, $permissions...)
// qui ne doivent jamais etre renvoyes dans le "data" d'un create/update -
// Appwrite rejette la requete sinon. Les formulaires admin pre-remplissent
// souvent formData avec le document entier (pour l'edition), d'ou ce
// nettoyage systematique cote service plutot que dans chaque composant.
const sanitizeDocumentData = (data = {}) =>
    Object.fromEntries(
        Object.entries(data).filter(([key]) => !key.startsWith("$"))
    );
    
    try {
    const user = await account.get();
    console.log("Utilisateur connecté :", user);
} catch (e) {
    console.error("Session invalide :", e);
}

export const createDocument = async(databaseId, collectionId, data)=> {
    try {
        const response = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            sanitizeDocumentData(data)
        );
        return response;
    } catch (error) {
        console.error('Erreur lors de la creation du document', error)
        throw error
    }
}

export const getDocuments = async(databaseId, collectionId) =>{
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        // Pas de console.log du contenu ici : certaines collections
        // (contact_messages, job_applications) contiennent des donnees
        // personnelles (email, telephone...) qui n'ont rien a faire dans
        // la console du navigateur, meme en developpement.
        return response.documents;
    } catch (error) {
        console.error('Erreur lors de la recuperation des documents', error);
        throw error
    }
}

export const updateDocument = async(databaseId, collectionId, documentId, data, permissions)=>{
    try {
        const response = await databases.updateDocument(
            databaseId,
            collectionId,
            documentId,
            sanitizeDocumentData(data), permissions
        )
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise a jour du document', error)
        throw error
    }
}

// --- Gestion des fichiers (images du blog, CV, etc.) ------------------------

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

export const validateFile = (file, { maxSizeBytes = MAX_FILE_SIZE_BYTES, allowedTypes } = {}) => {
    if (!file) return { valid: true };
    if (file.size > maxSizeBytes) {
        return { valid: false, error: `Le fichier depasse la taille maximale autorisee (${Math.round(maxSizeBytes / 1024 / 1024)} Mo).` };
    }
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return { valid: false, error: "Type de fichier non autorise." };
    }
    return { valid: true };
}

export const uploadFile = async (file, bucketId = MEDIA_BUCKET_ID, options = {}) => {
    const { valid, error } = validateFile(file, options);
    if (!valid) {
        throw new Error(error);
    }
    try {
        const response = await storage.createFile(bucketId, ID.unique(), file);
        return response;
    } catch (error) {
        console.error('Erreur lors de l\'upload du fichier', error)
        throw error
    }
}

export const getFileUrl = (fileId, bucketId = MEDIA_BUCKET_ID) => {
    if (!fileId) return null;
    return storage.getFileView(bucketId, fileId);
}

/**
 * Resout l'URL d'affichage d'une image, qu'elle vienne de Cloudinary (URL
 * complete stockee telle quelle) ou d'un ancien upload Appwrite (ID de
 * fichier). A utiliser partout ou une image de collection est affichee,
 * plutot que getFileUrl() seul, pour rester compatible avec le contenu
 * cree avant le passage a Cloudinary.
 */
export const resolveImageUrl = (value, bucketId = MEDIA_BUCKET_ID) => {
    if (!value) return null;
    if (typeof value === "string" && value.startsWith("http")) {
        return value; // deja une URL complete (Cloudinary ou autre)
    }
    return getFileUrl(value, bucketId); // ancien ID de fichier Appwrite
}

export const deleteFile = async (fileId, bucketId = MEDIA_BUCKET_ID) => {
    try {
        await storage.deleteFile(bucketId, fileId);
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier', error)
        throw error
    }
}

export const deleteDocument = async(databaseId, collectionId, documentId)=>{
    try {
        await databases.deleteDocument(
          databaseId,
          collectionId,
          documentId
        )
    } catch (error) {
        console.error('Erreur lors de la suppression du document', error)
        throw error
    }
}
