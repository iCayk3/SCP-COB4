import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Typography from '@mui/material/Typography';
import UploadOnCloud from '@/icons/UploadOnCloud';
import { ErrorMessage, RootStyle } from './styles';
export function DropZone({
  onDrop,
  error
}) {
  const [rejections, setRejections] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    maxSize: 1024 * 1024 * 5,
    // 5MB
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    },
    onDropRejected: rejectedFiles => setRejections(rejectedFiles)
  });
  const errorMessage = useMemo(() => {
    if (rejections.length > 0) return rejections[0].errors[0].message;else if (error) return error;
    return null;
  }, [rejections, error]);
  return <>
      <RootStyle isDragActive={isDragActive} error={!!errorMessage} {...getRootProps({
      className: 'dropzone'
    })}>
        <input {...getInputProps()} placeholder="Select click to browse" />

        <UploadOnCloud className="icon" />

        <Typography variant="body1" color={!!errorMessage ? 'error' : 'primary.main'}>
          Drop file here or click to upload
        </Typography>

        <Typography variant="body2" color="text.secondary" fontSize={12}>
          Drop files here or click to browse through your machine.
        </Typography>
      </RootStyle>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>;
}