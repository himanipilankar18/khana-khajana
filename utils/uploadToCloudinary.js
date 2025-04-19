const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
  
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
  
    data.append('upload_preset', 'khana_upload'); // replace with your actual preset
    data.append('cloud_name', 'dtl3fqbrt');       // replace with your cloud name
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dtl3fqbrt/image/upload', {
        method: 'POST',
        body: data,
      });
  
      const result = await res.json();
  
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };
  
  export default uploadToCloudinary;
  