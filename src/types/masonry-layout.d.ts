declare module 'masonry-layout' {
    export default class Masonry {
      constructor(container: Element | string, options?: Masonry.Options);
      layout(): void;
      reloadItems(): void;
    }
  
    namespace Masonry {
      interface Options {
        itemSelector?: string;
        columnWidth?: number | string;
        gutter?: number;
        fitWidth?: boolean;
      }
    }
  }
  