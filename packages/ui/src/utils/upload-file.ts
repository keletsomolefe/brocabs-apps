export const uploadFile = async (
  filePath: string,
  uploadUri: string,
  onProgress?: (progress: number) => void,
) => {
  const fileResponse = await fetch(filePath);
  const blob = await fileResponse.blob();

  if (onProgress) {
    // Use XMLHttpRequest for progress tracking — axios doesn't handle
    // React Native Blobs correctly and silently sends near-empty payloads.
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUri, true);
      xhr.setRequestHeader("Content-Type", blob.type || "application/octet-stream");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload network error"));
      xhr.send(blob);
    });
  }

  // Simple path — fetch handles RN Blobs natively (unlike axios)
  const response = await fetch(uploadUri, {
    method: "PUT",
    headers: {
      "Content-Type": blob.type || "application/octet-stream",
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
};

