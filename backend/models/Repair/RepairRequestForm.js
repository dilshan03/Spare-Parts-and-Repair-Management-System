import mongoose from "mongoose";

const RepairRequestFormSchema = new mongoose.Schema({
    customerNameR: { type: String, required: true },
    contactNumberR: { type: String, required: true }, 
    emailR: { type: String, required: true }, 
    addressR: { type: String },  
    vehicleRegiNumberR: { type: String, required: true }, 
    vehicleMakeR: { type: String, required: true }, 
    vehicleModelR: { type: String, required: true },
    yearOfManufactureR: { type: Number, required: true }, 
    mileageR: { type: Number },
    vehicleIdentiNumberR: { type: String }, 
    vehiclePhotoR: { data: Buffer, contentType: String}, 
    serviceTypeR: { type: String, required: true }, 
    descripIssueR: { type: String, required: true },  
    prefDateAndTimeR: { type: Date, required: true },  
    urgencyLevelR: { type: String, enum: ['Normal', 'Urgent'], required: true }, 
    paymentMethodR: { type: String, enum: ['Cash', 'Card', 'Online Payment'], required: true } 
});
 
const RepairRequestFormModel = mongoose.model("RepairRequestForm", RepairRequestFormSchema);

export default RepairRequestFormModel;
