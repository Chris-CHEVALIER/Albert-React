import { useEffect, useState } from 'react'
import EventCard from '../../components/EventCard'
import Select from '../../components/Select'
import { useData } from '../../contexts/DataContext'
import Modal from '../Modal'
import ModalEvent from '../ModalEvent'

import './style.css'

const perPage = 9

const EventList = () => {
  const { data, error } = useData()
  const [filteredEvents, setFilteredEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setFilteredEvents(data?.events || [])
  }, [data])

  // starting index for each page
  const startIndex = (currentPage - 1) * perPage
  // last index for each page
  const endIndex = currentPage * perPage

  // we cut the array to display
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

  const changeType = evtType => {
    // if we filter, we go back to page 1
    setCurrentPage(1)
    setFilteredEvents(
      (evtType
        ? data?.events.filter(event => event.type === evtType)
        : data?.events) || []
    )
  }

  // we calculate the number of pages
  const pageNumber = Math.ceil(filteredEvents.length / perPage)
  const typeList = new Set(data?.events.map(event => event.type))

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        'loading'
      ) : (
        <>
          <h3 className='SelectTitle'>Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={value => (value ? changeType(value) : changeType(null))}
          />
          <div id='events' className='ListContainer'>
            {paginatedEvents?.map(event => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className='Pagination'>
            {[...Array(pageNumber)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a
                key={`page-${n + 1}`}
                href='#events'
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default EventList
