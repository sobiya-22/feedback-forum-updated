export async function uploadImageToCloudinary(file) {
    const url = 'https://api.cloudinary.com/v1_1/drcmowihw/image/upload';
    const formData = new FormData();
    formData.append('file', file); // Add the file
    formData.append('upload_preset', 'feedback-forum-attachments'); // Unsigned preset

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.secure_url; // Get the uploaded image's URL
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}


