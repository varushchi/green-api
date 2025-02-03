import { ChatType } from '../types'


export default function Chat(props: ChatType) {
  return (
    <div className={`${props.subject === 'outgoing' ? 'bg-gray-300' : 'bg-green-300'}`}>
      {props.body}
    </div>
  )
}
