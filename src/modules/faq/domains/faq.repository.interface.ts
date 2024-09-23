import { Faq } from './faq';

export interface IFaqRepository {
  insert(faqs: Faq): Promise<Faq>;
  update(faqs: Faq): Promise<Faq>;
  delete(id: string): Promise<boolean>;
  getAllFaqs(withDeleted: boolean): Promise<Faq[]>;
  getFaqById(id: string, withDeleted: boolean): Promise<Faq>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
