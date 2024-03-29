import {v2 as cloudinary} from "cloudinary"
import fs from "fs"             // for unlink function -> delete

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)
            return null;
        
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto" 
        })
        // console.log("URL : " , response.url);
        fs.unlinkSync(localFilePath);           //! if successfully uploaded to cloudinary - delete from ./public/temp
        return response;
    
    } catch (error) {
        fs.unlink(localFilePath)        //* removes temporary file if error is thrown
        return null;
    }
}

const destroyOnCloudinary = async (todestroyUrl) => {
    try {
        if (!todestroyUrl) return null;
                //* (.png or .jpg or .gif) files preceded by [word or dot or $ sign]
        const regex = /[\w\.\$]+(?=.png|.jpg|.gif)/;
        let matches = regex.exec(todestroyUrl);     //* exec() -> returns "array" of matches

        if ((matches) !== null) {
            let matchingString = matches[0];       //* matching substring
            await cloudinary.uploader.destroy(matchingString)
                .then(result => console.log(result));
        }
    } catch (error) {
        console.error(error);
    }
}


export { uploadOnCloudinary , destroyOnCloudinary}