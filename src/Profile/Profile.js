import React, { useEffect, useState } from "react";
import { Avatar, Container, Box, Typography, TextField, InputLabel } from "@mui/material";
import ImageUpload from "../Components/ImageUpload";
import { auth, db, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { uuidv4 as uuid } from "@firebase/util";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profileName, setProfileName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  // Upload image to cloud storage
  const handleImageChange = (e) => {
    setProgress(0);
    setImageUploadSuccess(false);
    setImageUploadFail(false);
    setImageUpload(e.target.files[0]);
  };
  const handleUploadImage = () => {
    if (imageUpload) {
      const imageRef = ref(storage, `${uid}/images/${imageUpload.name + uuid()}`);
      const uploadTask = uploadBytesResumable(imageRef, imageUpload);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is" + progress + " % done");
        },
        (error) => {
          setImageUploadFail(true);
          setError("Image failed to upload");
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadSuccess(true);
            console.log("File available at", downloadURL);
            updateProfilePicture(downloadURL);
          });
        }
      );
    }
  };
  const updateProfilePicture = (downloadURL) => {
    updateDoc(userRef, { profilePic: downloadURL });
  };
  useEffect(() => {
    const unsub = onSnapshot(userRef, (snapshot) => {
      console.log(snapshot.data());
      const user = { ...snapshot.data(), id: snapshot.id };
      console.log(user);
      setProfileName(user.name);
      setProfilePic(user.profilePic);
    });
    return () => unsub();
  }, []);
  return (
    <Container sx={{ height: "90vh", display: "flex", alignItems: "center" }}>
      <Container
        maxWidth="lg"
        sx={{
          height: "80%",
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "background.secondary.main",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ display: { md: "none", xs: "block" } }}>
          Welcome {profileName}!
        </Typography>
        <Box>
          <Avatar
            src={profilePic}
            alt="profile pic"
            sx={{ width: { md: "250px", xs: "150px" }, height: { md: "250px", xs: "150px" } }}
          />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: { md: "block", xs: "none" } }}>
            Welcome {profileName}!
          </Typography>
          {/* <TextField label="Email" margin="normal" fullWidth />
          <TextField label="Password" margin="normal" sx={{ pb: 1 }} fullWidth /> */}
          <InputLabel sx={{ pb: 1 }}>Set Profile Picture:</InputLabel>
          <ImageUpload
            handleImageChange={handleImageChange}
            handleUploadImage={handleUploadImage}
            progress={progress}
            imageUploadSuccess={imageUploadSuccess}
            imageUploadFail={imageUploadFail}
          />
        </Box>
      </Container>
    </Container>
  );
};

export default Profile;
