import './lessons.style.scss'

// React
import { FunctionComponent, useEffect, useState } from 'react'

// Types
import { TStudent, TLesson, TNotes } from '../../types/types'

// Contexts
import { useStudents } from '../../contexts/StudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import { useNotes } from '../../contexts/NotesContext'
import { useLoading } from '../../contexts/LoadingContext'

// Components
import Button from '../../components/button/Button.component'
import Modal from '../../components/modals/modal.component'
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoPersonCircleOutline,
  IoPencil,
} from 'react-icons/io5'

import { HiPencilSquare } from 'react-icons/hi2'

// Functions

import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../utils/formateDate'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { toast } from 'react-toastify'

import { postLesson } from '../../supabase/supabase'

const lessonData: TLesson = {
  date: '',
  homework: '',
  studentId: 0,
  lessonContent: '',
}

interface LessonProps {}

const Lesson: FunctionComponent<LessonProps> = () => {
  const { loading } = useLoading()
  const [date, setDate] = useState<string>('')
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const { notes, setNotes } = useNotes()
  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)
  const [studentIndex, setStudentIndex] = useState(0)

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])
  const [currentNotes, setCurrentNotes] = useState<TNotes[]>([])

  const [previousLesson, setPreviousLesson] = useState<TLesson>()

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)

  const [modalOpen, setModalOpen] = useState(false)

  //EFFECTS

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    setDate(today)
  }, [])

  useEffect(() => {
    if (students) {
      const activeStudents = students.filter((student) => !student.archive)
      const sortedStudents = sortStudentsDateTime(activeStudents)
      setActiveStudents(sortedStudents)
    }
  }, [students])

  useEffect(() => {
    activeStudents && setCurrentStudent(activeStudents[studentIndex])
  }, [activeStudents, studentIndex])

  useEffect(() => {
    currentStudent &&
      setCurrentLessons(
        lessons.filter((lesson) => lesson.studentId === currentStudent.id)
      )
  }, [currentStudent, lessons])

  useEffect(() => {
    currentLessons &&
      setPreviousLesson(currentLessons[currentLessons.length - 1])
  }, [currentLessons, lessons])

  useEffect(() => {
    currentStudent &&
      setCurrentNotes(
        notes.filter((note) => note.studentId === currentStudent.id)
      )
  }, [currentStudent])

  // HANDLER
  const handlerNextStudent = () => {
    studentIndex < activeStudents.length - 1
      ? setStudentIndex(studentIndex + 1)
      : setStudentIndex(0)
  }

  const handlerPreviousStudent = () => {
    studentIndex > 0
      ? setStudentIndex(studentIndex - 1)
      : setStudentIndex(activeStudents.length - 1)
  }

  const handlerInputNewLesson = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...inputNewLesson, [name]: value }
    setInputNewLesson(newInput)
  }

  const handlerInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDate(value)
  }

  const handlerSaveLesson = () => {
    const tempID = Math.floor(Math.random() * 10000000)
    const newLesson: TLesson = {
      ...inputNewLesson,
      studentId: currentStudent.id,
      date: formatDateToDatabase(date),
      id: tempID,
    }

    // const tempNewLessons: TLesson[] = [...lessons, newLesson]
    setLessons((lessons) => [...lessons, newLesson])

    const postNewLesson = async () => {
      const [data] = await postLesson(newLesson)
      const newId = data.id

      setLessons((lessons) => {
        const newLessonsArray = lessons.map((lesson) =>
          lesson.id === tempID ? { ...lesson, id: newId } : lesson
        )
        return newLessonsArray
      })
    }
    postNewLesson()
    setInputNewLesson(lessonData)
    toast('Lektion gespeichert')
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }
  return (
    <>
      {loading && <p>loading</p>}
      {currentStudent ? (
        <header className="container container--header">
          <div className="container--infos">
            <div className="row-1">
              <div className="student-name">
                <IoPersonCircleOutline className="icon" />
                {currentStudent.firstName} {currentStudent.lastName}
              </div>

              <span> {currentStudent.durationMinutes} Minuten</span>
            </div>
            <p>
              {currentStudent.dayOfLesson} {currentStudent.startOfLesson} -{' '}
              {currentStudent.endOfLesson}
            </p>
          </div>
          <div className="container--buttons">
            <Button
              type="button"
              btnStyle="primary"
              handler={handlerPreviousStudent}
              icon={<IoArrowBackOutline />}
            />
            <Button
              type="button"
              btnStyle="primary"
              handler={handlerNextStudent}
              icon={<IoArrowForwardOutline />}
            />
          </div>
        </header>
      ) : null}
      <div className="container--content">
        <div className="middle">
          {previousLesson ? (
            <div className="container container--lessons container--previous-lesson">
              <Button
                type="button"
                btnStyle="icon-only"
                icon={<HiPencilSquare />}
                className="button--edit"
                handler={toggleModal}
              />
              <h5 className="heading-5">
                Letzte Lektion: {formatDateToDisplay(previousLesson.date)}
              </h5>
              <div className="container--two-rows">
                <div className="row-left">
                  <h4 className="heading-4">Lektion</h4>
                  <textarea
                    value={previousLesson.lessonContent}
                    onChange={() => {}}
                  />
                </div>
                <div className="row-right">
                  <h4 className="heading-4">Hausaufgaben</h4>
                  <textarea
                    value={previousLesson.homework}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="container container--lessons container--new-lesson">
            <h3 className="heading-3">
              Aktuelle Lektion
              <span>
                <input type="text" value={date} onChange={handlerInputDate} />
              </span>
            </h3>
            <div className="container--two-rows">
              <div className="row-left">
                <h4 className="heading-4">Lektion</h4>
                <textarea
                  name="lessonContent"
                  autoFocus
                  value={inputNewLesson.lessonContent}
                  onChange={handlerInputNewLesson}
                ></textarea>
              </div>
              <div className="row-right">
                <h4 className="heading-4">Hausaufgaben</h4>
                <textarea
                  name="homework"
                  value={inputNewLesson.homework}
                  onChange={handlerInputNewLesson}
                ></textarea>
              </div>
            </div>
            <Button
              type="button"
              btnStyle="primary"
              label="Speichern"
              className="btn--save"
              handler={handlerSaveLesson}
            />
          </div>
        </div>
        <div className="left">
          <h4 className="heading-4">Notizen</h4>
          {currentNotes &&
            currentNotes.map((note) => (
              <div className="note" key={note.id}>
                <h5 className="heading-5">{note.title}</h5>
                <p>{note.text}</p>
              </div>
            ))}
        </div>
      </div>
      {modalOpen && (
        <Modal
          heading="Lektion bearbeiten"
          handlerOverlay={toggleModal}
          handlerClose={toggleModal}
          buttons={[
            { label: 'Speichern', btnStyle: 'primary', handler: () => {} },
          ]}
        />
      )}
    </>
  )
}

export default Lesson
