import { ChatType } from '../types'


export default function Chat(props: ChatType) {
  return (
    <div
      className={`
        ${props.subject === 'outgoing' ? 'bg-gray-200 text-black self-end' :
          props.subject === 'error' ? 'bg-red-500 text-white self-center' :
          'bg-green-400 text-white self-start'}
        w-fit max-w-2/3 break-words p-[5px] rounded-[10px] flex flex-col
      `}
      id={props.id}
      key={props.id}
    >
      <p className='self-center'>
        {props.body}
      </p>
      <p className='self-end text-xs'>
        {props.time}
      </p>
    </div>
  );
}
