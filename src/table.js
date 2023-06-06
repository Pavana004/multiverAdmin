import React, { useEffect, useState } from "react";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "./Firebase";
import axios from "axios";
import { toast} from 'react-toastify';



const Table = () => {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };


    const uploadFile = (file, urlType) => {
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "poster" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.log(error)
             },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };

                    });
                });
            }
        );
    };

    useEffect(() => {
        video && uploadFile(video, "video");
    }, [video]);

    useEffect(() => {
        img && uploadFile(img, "poster");
    }, [img]);


    const handleUpload = async (e) => {
        e.preventDefault();
        try {
              await axios.post("https://multiverse-ott.onrender.com/api/movies", inputs);
              window.location.reload();
              toast.dark("Data Add Successfully In Database");

        } catch (error) {
            toast.error("Check the Field");
        }
    }

    return (
        <>
            <h3 className="admin">Multiverse Admin</h3>
            <h4>Movies-Field</h4>
            <form className="row g-3 needs-validation" >
                <div className="col-md-4">
                    <label  className="form-label">Title</label>
                    <input type="text" className="form-control"
                        name="title"
                        onChange={handleChange}
                        required />


                </div>
                <div className="col-md-4">
                    <label  className="form-label">Poster</label>
                    {imgPerc > 0 ? (
                        "Uploading:(" + imgPerc + ")%"
                    ) : (
                        <input type="file" className="form-control"
                            name="poster"
                            onChange={(e) => setImg(e.target.files[0])}
                            required />
                    )}

                </div>

                <div className="col-md-4">
                    <label  className="form-label">videos</label>
                    {videoPerc > 0 ? (
                        "Uploading:(" + videoPerc + ")%"
                    ) : (
                        <input type="file" className="form-control"
                            name="video"
                            onChange={(e) => setVideo(e.target.files[0])}
                            required />
                    )}
                </div>
                <div className="col-md-4">
                    <label  className="form-label">Genre</label>
                    <input type="text" className="form-control"
                        name="genre"
                        onChange={handleChange}
                        required />


                </div>
                <div className="col-12">
                    <button className="btn" type="submit" onClick={handleUpload}>Uploads</button>
                </div>

            </form>

        </>


    );
};

export default Table;