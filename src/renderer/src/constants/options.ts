export const ImagesFormatOptions: Array<OptionsModel<ImagesFormat>> = [
  { label: 'JPG', value: 'jpg' },
  { label: 'PNG', value: 'png' },
  { label: 'GIF', value: 'gif' },
  { label: 'WEBP', value: 'webp' },
  { label: 'TIFF', value: 'tiff' },
  { label: 'BMP', value: 'bmp' }
];

export const VideosFormatOptions: Array<OptionsModel<VideosFormat>> = [
  { label: 'MOV', value: 'mov' },
  { label: 'MP4', value: 'mp4' }
];

export const VideosResolutionOptions: Array<OptionsModel<VideosResolution>> = [
  { label: '4K(4K,4096x2160)', value: '4096x2160' },
  { label: '4K(4K,3840x2160)', value: '3840x2160' },
  { label: '2K(2K,2560x1440)', value: '2560x1440' },
  { label: '全高清(1080p,1920x1080)', value: '1920x1080' },
  { label: '高清(720p,1280x720)', value: '1280x720' },
  { label: '标清(480p,720x480)', value: '720x480' },
  { label: '标清(480p,640x480)', value: '640x480' },
  { label: '流畅(240p,320x240)', value: '320x240' }
];

export const VideosFrameRateOptions: Array<OptionsModel<VideosFrameRate>> = [
  // { label: '144', value: 144 },
  // { label: '120', value: 120 },
  { label: '60', value: 60 },
  { label: '30', value: 30 },
  { label: '15', value: 15 }
];

export const AudiosFormatOptions: Array<OptionsModel<AudiosFormat>> = [
  { label: 'MP3', value: 'mp3' },
  { label: 'WAV', value: 'wav' }
];
