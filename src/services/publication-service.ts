import { Publication } from '../types/publication.type';

export class PublicationService {
  private static instance: PublicationService;
  private publications: Publication[] = [];
  private readonly STORAGE_KEY = 'publications';

  private constructor() {
    this.loadPublications();
  }

  public static getInstance(): PublicationService {
    if (!PublicationService.instance) {
      PublicationService.instance = new PublicationService();
    }
    return PublicationService.instance;
  }

  private loadPublications(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.publications = JSON.parse(stored);
    }
  }

  private savePublications(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.publications));
  }

  public getPublications(): Publication[] {
    return [...this.publications];
  }

  public addPublication(publication: Omit<Publication, 'id'>): Publication {
    const newPublication: Publication = {
      ...publication,
      id: crypto.randomUUID()
    };
    this.publications.push(newPublication);
    this.savePublications();
    return newPublication;
  }

  public deletePublication(id: string): void {
    this.publications = this.publications.filter(pub => pub.id !== id);
    this.savePublications();
  }
} 