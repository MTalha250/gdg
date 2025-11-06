import PhotosUploader from "../PhotosUploader/PhotosUploader";

export default function ReceiptUploader({
  receipt,
  setReceipt,
}: {
  receipt: string | null;
  setReceipt: (url: string | null) => void;
}) {
  const handleChange = (photos: string[]) => {
    setReceipt(photos[0] || null);
  };

  return (
    <PhotosUploader
      addedPhotos={receipt ? [receipt] : []}
      maxPhotos={1}
      onChange={handleChange}
    />
  );
}
