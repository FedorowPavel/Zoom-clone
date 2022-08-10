import React, {useEffect, useRef} from 'react';

const LocalScreenSharingPreview = ({stream}) => {
  const localPreviewRef = useRef()

  useEffect(() => {
    const video = localPreviewRef.current;
    console.log(video)
    video.srcObject = stream;
    console.log(stream)

    video.onloadedmetadata = () => {
      video.play()
    }
  },[stream])
  return (
    <div className='local_screen_share_preview'>
      <video muted ref={localPreviewRef}/>
    </div>
  );
};

export default LocalScreenSharingPreview;
