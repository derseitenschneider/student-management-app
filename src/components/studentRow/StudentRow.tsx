import './studentrow.styles.scss'
import {
  ChangeEvent,
  FunctionComponent,
  FunctionComponentElement,
  ReactComponentElement,
  useState,
} from 'react'
import { TStudent } from '../../types/types'
import { IconType } from 'react-icons/lib'
import { useStudents } from '../../contexts/StudentContext'
import { postUpdateStudent } from '../../supabase/students/students.supabase'

interface StudentRowProps {
  student: TStudent
  form: boolean
  buttons?: {
    label: string
    icon: IconType
    className?: string
    handler: (e: React.MouseEvent) => void
  }[]
}

const StudentRow: FunctionComponent<StudentRowProps> = ({
  student,
  form,
  buttons,
}) => {
  const { students, setStudents } = useStudents()
  const [inputCurrentStudent, setInputCurrentStudent] = useState(student)

  const hanlderOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...inputCurrentStudent, [name]: value }

    setInputCurrentStudent(newInput)
  }

  const handlerOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name
    const id = +e.target.dataset.id
    const newStudents = students.map((student) =>
      student.id === id ? { ...student, [name]: value } : student
    )
    setStudents(newStudents)
    postUpdateStudent(id, name, value)
  }

  const handlerOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const name = e.target.name
    const id = +e.target.dataset.id
    const newStudents = students.map((student) =>
      student.id === id ? { ...student, [name]: value } : student
    )
    setStudents(newStudents)
    postUpdateStudent(id, name, value)
  }

  return (
    <tr key={student.id} className="student-row">
      <td>
        <input type="checkbox" name="" id="" className="checkbox" />
      </td>
      <td>
        {form && (
          <input
            className="input input--firstName"
            data-id={inputCurrentStudent.id}
            type="text"
            value={inputCurrentStudent.firstName}
            name="firstName"
            onChange={hanlderOnChange}
            onBlur={handlerOnBlur}
          />
        )}
        {!form && <span>{student.firstName}</span>}
      </td>
      <td>
        {form && (
          <input
            className="input input--lastName"
            data-id={inputCurrentStudent.id}
            type="text"
            value={inputCurrentStudent.lastName}
            name="lastName"
            onChange={hanlderOnChange}
            onBlur={handlerOnBlur}
          />
        )}
        {!form && <span>{student.lastName}</span>}
      </td>
      <td>
        {form && (
          <input
            className="input input--instrument"
            data-id={inputCurrentStudent.id}
            type="text"
            value={inputCurrentStudent.instrument}
            name="instrument"
            onChange={hanlderOnChange}
            onBlur={handlerOnBlur}
          />
        )}
        {!form && <span>{student.instrument}</span>}
      </td>
      {form && (
        <>
          <td>
            <select
              className="input input--dayOfLesson"
              data-id={inputCurrentStudent.id}
              name="dayOfLesson"
              id=""
              defaultValue={inputCurrentStudent.dayOfLesson}
              onChange={handlerOnSelect}
            >
              <option value="Montag">Montag</option>
              <option value="Dienstag">Dienstag</option>
              <option value="Mittwoch">Mittwoch</option>
              <option value="Donnerstag">Donnerstag</option>
              <option value="Freitag">Freitag</option>
            </select>
          </td>
          <td>
            <input
              data-id={inputCurrentStudent.id}
              name="startOfLesson"
              type="text"
              value={inputCurrentStudent.startOfLesson}
              onChange={hanlderOnChange}
              onBlur={handlerOnBlur}
              className="input input--time"
            />
            <span>-</span>
            <input
              data-id={inputCurrentStudent.id}
              name="endOfLesson"
              type="text"
              value={inputCurrentStudent.endOfLesson}
              onChange={hanlderOnChange}
              onBlur={handlerOnBlur}
              className="input input--time"
            />
          </td>
          <td>
            <input
              name="durationMinutes"
              data-id={inputCurrentStudent.id}
              type="text"
              value={inputCurrentStudent.durationMinutes}
              onChange={hanlderOnChange}
              onBlur={handlerOnBlur}
              className="input input--duration"
            />
            <span>min</span>
          </td>
          <td>
            <input
              name="location"
              data-id={inputCurrentStudent.id}
              type="text"
              value={inputCurrentStudent.location}
              className="input input--location"
              onChange={hanlderOnChange}
              onBlur={handlerOnBlur}
            />
          </td>
        </>
      )}

      <td className="buttons">
        {buttons?.map((button) => (
          <button
            title={button.label}
            onClick={button.handler}
            className={`button button--${button.label.toLocaleLowerCase()}`}
            data-id={student.id}
          >
            <button.icon
              className={`icon icon--${button.label.toLocaleLowerCase()}`}
            />
          </button>
        ))}
      </td>
    </tr>
  )
}

export default StudentRow
