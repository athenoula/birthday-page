const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`

export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET)
}

export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const res = await fetch(UPLOAD_URL, { method: "POST", body: formData })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || "Upload failed")
  }

  const data = await res.json()
  return {
    url: data.secure_url,
    type: data.resource_type === "video" ? "video" : "photo",
  }
}
