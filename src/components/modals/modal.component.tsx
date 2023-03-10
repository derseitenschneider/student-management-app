import { FunctionComponent, ReactNode } from 'react'
import './modal.style.scss'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../button/Button.component'

interface ModalProps {
  heading: string
  children?: ReactNode
  handlerOverlay: (e: React.MouseEvent) => void
  handlerClose: (e: React.MouseEvent) => void
  className?: string
  buttons: {
    label: string
    handler: (e: React.MouseEvent) => void
    btnStyle: 'primary' | 'secondary' | 'warning' | 'danger'
  }[]
}

const Modal: FunctionComponent<ModalProps> = ({
  heading,
  children,
  handlerOverlay,
  handlerClose,
  buttons,
  className,
}) => {
  return (
    <div className={`container-modal ${className}`}>
      <div className="modal">
        <button onClick={handlerClose} className="button--close-modal">
          <IoCloseOutline />
        </button>
        <h2 className="heading-modal">{heading}</h2>
        {children}
        <div className="container-buttons">
          {buttons.map((button) => (
            <Button
              handler={button.handler}
              label={button.label}
              type="button"
              btnStyle={button.btnStyle}
            />
          ))}
        </div>
        <div onClick={handlerOverlay} className="overlay"></div>
      </div>
    </div>
  )
}

export default Modal
