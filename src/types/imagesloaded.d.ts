declare module 'imagesloaded' {
    interface ImagesLoaded {
      (elem: Element | string, callback: () => void): void;
    }
  
    const imagesLoaded: ImagesLoaded;
    export default imagesLoaded;
  }
  