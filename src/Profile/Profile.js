import React, { useEffect, useState } from "react";
import { Avatar, Container, Box, Typography, TextField, InputLabel, Tooltip } from "@mui/material";
import ImageUpload from "../Components/ImageUpload";
import { auth, db, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { uuidv4 as uuid } from "@firebase/util";
import { doc, onSnapshot } from "firebase/firestore";
import { SettingsSuggestRounded } from "@mui/icons-material";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const uid = user.uid;
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
            setImageUrl(downloadURL);
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };
  useEffect(() => {
    const userRef = doc(db, "users", uid);
    console.log();
    const unsub = onSnapshot(userRef, (snapshot) => {
      console.log(snapshot.data());
      const user = { ...snapshot.data(), id: snapshot.id };
      console.log(user);
      setUserProfile(user);
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
          Profile Page
        </Typography>
        <Box>
          <Avatar
            src="images/drake.jpeg"
            alt="profile pic"
            sx={{ width: { md: "300px", xs: "150px" }, height: { md: "300px", xs: "150px" } }}
          />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: { md: "block", xs: "none" } }}>
            Profile Page
          </Typography>
          <TextField label="Email" margin="normal" fullWidth />
          <TextField label="Password" margin="normal" sx={{ pb: 1 }} fullWidth />
          <InputLabel sx={{ pb: 1 }}>Profile Picture:</InputLabel>

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
