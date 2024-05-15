import { ContactUs } from "./conatct-us.model"
import { ContactUsType } from "./contact-us.types"

const createContact = async (contact : ContactUsType)=>{
    try{
    const newContact = await ContactUs.create(contact)

    return newContact
    }catch(e){
        console.log("error while creating a contact", e)
    }
}

const contactUsService = {
    create : createContact
}

export {contactUsService}