import Image from 'next/image'
import styles from './page.module.css'
import Row from './components/Row'
import Board from './components/Board'


export default function Home() {
  return (
    <>
      <div className='interface'>
        <h1>Box Words</h1>
      </div>
      <div className="line">
        <hr />
      </div>
      <Board />
    </>
  )
}
