export interface Note {
  id: string;
  title: string;
  body: any;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormValues {
  title: string;
  body: any;
}
