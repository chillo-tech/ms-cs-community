import { Contact } from './contact.model';
import { ContactType } from './contact.types';


const createContact = async (submittedAvis: ContactType) => {
  try {
    const avis = await Contact.create(submittedAvis);
    return avis.toJSON();
  } catch (error) {
    console.error("Erreur lors de la creation d'un avis");
  }
};

const contactService = {
  create: createContact,
};
export { contactService };

