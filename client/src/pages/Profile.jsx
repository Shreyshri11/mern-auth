/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOut,
} from "../redux/user/userSlice";

export default function Profile() {
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const { currentUser, loading, error } = useSelector((state) => state.user);
    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);
    /**
     * Handles file upload to Firebase Storage.
     *
     * @param {File} image - The image file to be uploaded.
     */
    const handleFileUpload = async (image) => {
        // Get storage instance from Firebase
        const storage = getStorage(app);

        // Create a unique file name using current time to prevent overwrites
        const fileName = new Date().getTime() + image.name;

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, fileName);

        // Start the upload process
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Monitor the upload progress
        uploadTask.on(
            "state_changed",

            // This function runs while the file is being uploaded
            (snapshot) => {
                // Calculate upload progress percentage
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                // Update the progress state
                setImagePercent(Math.round(progress));
            },

            // This function runs if there is an error during upload
            (error) => {
                setImageError(true);
            },

            // This function runs after the upload is successful
            () => {
                // Get the download URL of the uploaded file
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    // Update form data with the uploaded image URL
                    setFormData({ ...formData, profilePicture: downloadURL })
                );
            }
        );
    };
    // Handles input field changes and updates form data dynamically
    const handleChange = (e) => {
        setFormData({
            ...formData, // Keep existing form data unchanged
            [e.target.id]: e.target.value, // Update only the changed field
        });
    };

    // Handles form submission and updates user data
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page refresh on form submission

        try {
            dispatch(updateUserStart()); // Notify the system that an update is starting

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST", // Sends data using the POST method
                headers: { "Content-Type": "application/json" }, // Set request content type to JSON
                body: JSON.stringify(formData), // Convert form data to JSON format
            });

            const data = await res.json(); // Wait for the server response and parse it as JSON

            if (data.success === false) {
                dispatch(updateUserFailure(data)); // Notify the system if the update fails
                return; // Stop further execution
            }

            dispatch(updateUserSuccess(data)); // Notify the system if the update succeeds
            setUpdateSuccess(true); // Set state to indicate success
        } catch (error) {
            dispatch(updateUserFailure(error)); // Handle errors by notifying the system
        }
    };

    // Handles user account deletion
    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart()); // Notify the system that a delete process has started

            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE", // Sends a DELETE request to remove the user
            });

            const data = await res.json(); // Wait for the server response and parse it as JSON

            if (data.success === false) {
                dispatch(deleteUserFailure(data)); // Notify the system if deletion fails
                return; // Stop further execution
            }

            dispatch(deleteUserSuccess(data)); // Notify the system if deletion succeeds
        } catch (error) {
            dispatch(deleteUserFailure(error)); // Handle errors by notifying the system
        }
    };

    // Handles user sign-out
    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/signout"); // Send request to log out the user
            dispatch(signOut()); // Update the system to indicate the user has signed out
        } catch (error) {
            console.log(error); // Print any errors to the console
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
                <img
                    src={formData.profilePicture || currentUser.profilePicture}
                    alt="profile"
                    className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
                    onClick={() => fileRef.current.click()}
                />
                <p className="text-sm self-center">
                    {imageError ? (
                        <span className="text-red-700">
                            Error uploading image (file size must be less than 2
                            MB)
                        </span>
                    ) : imagePercent > 0 && imagePercent < 100 ? (
                        <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
                    ) : imagePercent === 100 ? (
                        <span className="text-green-700">
                            Image uploaded successfully
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <input
                    defaultValue={currentUser.username}
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="bg-slate-100 rounded-lg p-3"
                    onChange={handleChange}
                />
                <input
                    defaultValue={currentUser.email}
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-slate-100 rounded-lg p-3"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-slate-100 rounded-lg p-3"
                    onChange={handleChange}
                />
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                    {loading ? "Loading..." : "Update"}
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteAccount}
                    className="text-red-700 cursor-pointer"
                >
                    Delete Account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer"
                >
                    Sign out
                </span>
            </div>
            <p className="text-red-700 mt-5">
                {error && "Something went wrong!"}
            </p>
            <p className="text-green-700 mt-5">
                {updateSuccess && "User is updated successfully!"}
            </p>
        </div>
    );
}
