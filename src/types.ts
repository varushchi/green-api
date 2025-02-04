export interface ChatType{
  body: string,
  subject: 'incoming' | 'outgoing' | 'error',
  id: string,
  time: string
}