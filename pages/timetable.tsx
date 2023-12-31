import LineBreaks from "@/components/line-breaks";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import styles from "@/styles/Timetable.module.css";
import adaptivePlugin from "@fullcalendar/adaptive";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

type FlattenedClass = {
	id: string;
	name: string;
	startTime: string;
	endTime: string;
	cost: string;
	daysOfWeek: number[];
	backgroundColor: string;
	age: string | null;
	description: string;
};

function Timetable({ classes }: { classes: FlattenedClass[] }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [eventInfo, setEventInfo] = useState<EventClickArg | null>(null);

	return (
		<>
			<Head>
				<title>Virtue Movement - Timetable</title>
				<meta name="description" content="Virtue Movement" />
			</Head>
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
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,listWeek",
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
					events={classes}
					eventTimeFormat={{
						hour: "numeric",
						minute: "2-digit",
						meridiem: false,
					}}
					weekNumberCalculation={"ISO"}
				/>
				<Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className={"text-center"}>
								{eventInfo?.event?.title}
							</DialogTitle>
							<DialogDescription>
								<p className={"text-center"}>
									{eventInfo?.event?.extendedProps?.cost}
								</p>
								<p className={"text-center"}>
									{eventInfo?.event?.extendedProps?.age}
								</p>
							</DialogDescription>
						</DialogHeader>
						<p>{eventInfo?.event?.extendedProps?.description}</p>
						<Link href={`/bookings/new?class=${eventInfo?.event?.id}`}>
							<Button className={"w-full"} type={"submit"}>
								Book This Class
							</Button>
						</Link>
					</DialogContent>
				</Dialog>
			</div>
			<LineBreaks />
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch("https://virtue.rcn.sh/api/fetchTimetable");
	const classes = await response.json();
	return {
		props: {
			classes,
		},
	};
}

export default Timetable;
