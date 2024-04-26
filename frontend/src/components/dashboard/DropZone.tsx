"use client";
import { toast } from "sonner";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressBar from "./Progress";
import Cookies from "js-cookie";
export const UploadDropzone = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);



  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });

        try {
          const token = JSON.parse(Cookies.get("userInfo") as string).token;
          const res = await fetch("http://127.0.0.1:9010/api/files/upload", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            toast.success("Files uploaded successfully");
            router.push("/dashboard/files");
          } else {
            toast.error("Failed to upload files");
            setIsUploading(false);
          }
        } catch (error) {
          toast.error("Error uploading files");
          setIsUploading(false);
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
         <div
         {...getRootProps()}
         className='border h-96 w-[500px] m-4 border-dashed border-gray-300 rounded-lg'>
         <div className='flex items-center justify-center h-full w-full'>
           <label
             htmlFor='dropzone-file'
             className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
             <div className='flex flex-col items-center justify-center pt-5 pb-6'>
               <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
               <p className='mb-2 text-sm text-zinc-700'>
                 <span className='font-semibold'>
                   Click to upload
                 </span>{' '}
                 or drag and drop
               </p>
               <p className='text-xs text-zinc-500'>
                 PDF (up to {isSubscribed ? "16" : "4"}MB)
               </p>
             </div>

             {acceptedFiles && acceptedFiles[0] ? (
               <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                 <div className='px-3 py-2 h-full grid place-items-center'>
                   <File className='h-4 w-4 text-blue-500' />
                 </div>
                 <div className='px-3 py-2 h-full text-sm truncate'>
                   {acceptedFiles[0].name}
                 </div>
               </div>
             ) : null}

             {isUploading ? (
               <div className='w-full mt-4 max-w-xs mx-auto'>
                 <ProgressBar
                   indicatorColor={
                     uploadProgress === 100
                       ? 'bg-green-500'
                       : ''
                   }
                   value={uploadProgress}
                 />
                 {uploadProgress === 100 ? (
                   <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                     <Loader2 className='h-3 w-3 animate-spin' />
                     Redirecting...
                   </div>
                 ) : null}
               </div>
             ) : null}

             <input
               {...getInputProps()}
               type='file'
               id='dropzone-file'
               className='hidden'
             />
           </label>
         </div>
       </div>
      )}
    </Dropzone>
  );
};
