export interface ItemProps {
  _id?: string;
  text: string;
  read: boolean;
  sender: string;
  created: Date;
  userId?: string;
}