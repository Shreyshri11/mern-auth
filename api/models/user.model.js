import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrDvWiASUjumELvh2nx4n-kNLPuxGFr_pRp_-02AgfneTekCam67JbVNE&s",
        },
    },
    { timestamps: true }
); ;

const user = mongoose.model('User', userSchema) ;

export default user ;