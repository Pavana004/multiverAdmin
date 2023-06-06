import React, { useEffect, useState } from "react";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "./Firebase";
import axios from "axios";
import { toast} from 'react-toastify';



const Album = () => {
    const [img, setImg] = useState(undefined);
    const [album, setAlbum] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [albumPerc, setAlbumPerc] = useState(0);
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
                urlType === "poster" ? setImgPerc(Math.round(progress)) : setAlbumPerc(Math.round(progress));
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
        album && uploadFile(album, "album");
    }, [album]);

    useEffect(() => {
        img && uploadFile(img, "poster");
    }, [img]);


    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://multiverse-ott.onrender.com/api/albums", inputs);
            toast.dark("Data Add Successfully In Database");
            console.log(res);

        } catch (error) {
            toast.error("Check the Field");
        }
    }

    return (
        <>
            
            <h4>Album-Field</h4>
            <form className="row g-3 needs-validation" onSubmit={handleUpload}>
                <div className="col-md-4">
                    <label  className="form-label">Title</label>
                    <input type="text" className="form-control"
                        name="title"
                        onChange={handleChange}
                        required />

                </div>
                <div className="col-md-4">
                    <label className="form-label">Poster</label>
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
                    <label  className="form-label">Album</label>
                    {albumPerc > 0 ? (
                        "Uploading:(" + albumPerc + ")%"
                    ) : (
                        <input type="file" className="form-control"
                            name="album"
                            onChange={(e) => setAlbum(e.target.files[0])}
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
                    <button className="btn" type="submit" >Uploads</button>
                </div>

            </form>

        </>
    );
};

export default Album;