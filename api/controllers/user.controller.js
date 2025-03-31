import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import user from "../models/user.model.js";

export const test = (req, res) => {
    res.json({
        message: "API is working!",
    });
};

//update user

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your account!"));
    }

    try {
        if (req.body.password) {
            // Hash the password before saving it to the database
            req.body.password = await bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            { new: true } // Return the updated document, to see the updated user not the old one
        ) ;

        // send the user info to the client side 
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest) ;
    } catch (error) {
        next(error);
    }
};

//delete user

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete only account!"));
    }

    try {
        await user.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.") ;
    } catch (error) {
        next(error);
    }
}