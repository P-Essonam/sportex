"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';


import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import { FileIcon, UploadCloud, X } from 'lucide-react';
import { getSignedUrl as cloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import getSignedURL from '@/data/s3/putObject';


interface FileWithPreview extends File {
  preview: string;
}

type S3UploadObjectProps = {
  accept: Accept;
  maxSize: number;
  acceptName: string;
  showErrorMessage: string;
  onChange: (url?: string) => void;
  value: string;
}

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};


const UploadObjectBucket = ({ accept, maxSize, acceptName, showErrorMessage, onChange,value}: S3UploadObjectProps) => {

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileType = value?.split(".").pop();
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!value || value.startsWith('https')) {
      setImage(value);
      return;
    };
    const signedUrl = cloudfrontSignedUrl({
        url: process.env.NEXT_PUBLIC_CLOUDFRONT_S3_URL + value,
        privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY!,
        keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEYPAIR_ID!,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    });
    setImage(signedUrl)
  }, [value])


  const fileSize = maxSize / (1024 * 1024);

  const onDropHandler = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMessage(showErrorMessage);
    } else {
      const file = acceptedFiles[0];
      const checkSum = await computeSHA256(file);
      const signedUrl = await getSignedURL({ fileType: file.type, fileSize: file.size, checksum: checkSum });
      if (signedUrl.failure) {
        console.error(signedUrl.failure);
        return;
      }


      const url = signedUrl.success?.url;
      if (!url) return;

     
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            setFiles(
              acceptedFiles.map((file) => {
                return Object.assign(file, {
                  preview: url.split("?")[0],
                });
              })
            );
            onChange(url.split("/").pop()?.split("?")[0]);
            console.log("File uploaded successfully");
          } else {
            console.error("Error uploading file");
            setErrorMessage("Error uploading file");
          }
          setUploadProgress(0); 
        }

      };

      xhr.send(file);
    }
    setErrorMessage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop: onDropHandler,
    maxFiles: 1,
    onDropRejected: (fileRejections: FileRejection[]) => {
      setErrorMessage(showErrorMessage);
    },
    maxSize,
  });

  return (
    <section className="container border-dashed border-2 bg-muted text-muted-foreground border-muted-foreground/40 p-4 rounded cursor-pointer h-[200px] max-w-5xl flex flex-col justify-center items-center">

      {uploadProgress === 0 && !value.length && (
        <div {...getRootProps({ className: 'dropzone p-4 rounded cursor-pointer h-full w-full flex justify-center items-center flex-col space-y-3' })}>
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">
            {errorMessage || <UploadCloud className='w-8 h-8' />}
          </p>
          <div className='text-center'>Choose files or drag and drop</div>
          <div className="text-xs text-gray-500">{acceptName} {`(${fileSize}MB)`}</div>
        </div>
      )}
      
      {value && (
        <div className="flex flex-wrap mt-4">
        
            <div className="flex flex-col items-center">
              {image.length ||  fileType != "pdf"? (
                <div className="relative flex items-center p-2 mt-2 rounded-full bg-background/10 h-32 w-32">
                  {image && <Image
                    sizes='100px'
                    fill
                    src={image}
                    className="rounded-full object-cover"
                    alt={`upload`}
                    priority={true}
                  />}
                  <button
                    onClick={async () => {
                      
                        onChange("")
                        setUploadProgress(0)
                        setImage("")
                    }}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative flex items-center p-4 mt-2 rounded-md bg-background/10 border border-slate-300">
                  <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                  <a
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                  />
                  <button
                    onClick={async () => {
                      
                        onChange("")
                        setUploadProgress(0)
                        setImage("")
                    }}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
          
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="mt-4 w-[150px] mx-auto border-none rounded-lg text-center">
          <div className="h-8 border-none w-full rounded-lg bg-primary/50">
            <div className="h-full bg-primary/90 rounded-lg" style={{ width: `${uploadProgress}%` }}/>
          </div>
        </div>
      )}


    </section>
  );
};

export default UploadObjectBucket;