import { NextPage } from 'next';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import adaptivePlugin from '@fullcalendar/adaptive';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import styles from '@/styles/Timetable.module.css';
import { useState } from 'react';
import LineBreaks from '@/components/line-breaks';
import { EventClickArg } from '@fullcalendar/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Calendar: NextPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState<EventClickArg | null>(null);

  return (
    <>
      <div className={styles.calendar}>
        <FullCalendar
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            adaptivePlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek',
          }}
          initialView="dayGridMonth"
          nowIndicator={false}
          editable={false}
          selectable={true}
          selectMirror={true}
          eventClick={(info) => {
            setModalIsOpen(true);
            setEventInfo(info);
          }}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
          }}
          weekNumberCalculation={'ISO'}
        />
        <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className={'text-center'}>
                {eventInfo?.event?.title}
              </DialogTitle>
              <DialogDescription>
                <p className={'text-center'}>
                  {eventInfo?.event?.extendedProps?.cost}
                </p>
                <p className={'text-center'}>
                  {eventInfo?.event?.extendedProps?.age}
                </p>
              </DialogDescription>
            </DialogHeader>
            <p>{eventInfo?.event?.extendedProps?.description}</p>
            <Link href={`/bookings/new?class=${eventInfo?.event?.id}`}>
              <Button className={'w-full'} type={'submit'}>
                Book This Class
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      </div>
      <LineBreaks />
    </>
  );
};

export default Calendar;
