import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import classes from "@/pages/api/json/classes.json";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { students } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
	selected_class: z.string({
		required_error: "Please select a class to book.",
	}),
	selected_student: z.string({
		required_error: "Please select a student for this class.",
	}),
	user_id: z.string(),
});

interface ClassData {
	id: string;
	name: string;
}

function uniqueByIdAndName(
	data: Array<{ id: string; name: string }>,
): Array<{ id: string; name: string }> {
	const uniqueBookings = data.filter(
		(currentItem, index, array) =>
			!array
				.slice(0, index)
				.some(
					(item) =>
						item.id === currentItem.id && item.name === currentItem.name,
				),
	);

	uniqueBookings.sort((a, b) => a.name.localeCompare(b.name));

	return uniqueBookings;
}

function NewBookingForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const classTitle = searchParams.get("class") || undefined;
	const [uniqueClasses, setUniqueClasses] = useState<ClassData[]>([]);
	const [classOpen, setClassOpen] = useState(false);
	const [usersStudents, setUsersStudents] = useState<students[]>();
	const [submittedForm, setSubmittedForm] = useState(false);
	const [alreadyBooked, setAlreadyBooked] = useState(false);
	const { userId } = useAuth();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	useEffect(() => {
		if (!userId) {
			return;
		}
		form.setValue("user_id", userId);

		fetch(
			`/api/fetch/getAllUsersStudents?user_id=${encodeURIComponent(userId)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		).then(async (response) => {
			if (response.ok) {
				const data = await response.json();
				setUsersStudents(data);
			} else {
				console.error("Error getting students:", response);
			}
		});
	}, [form, userId]);

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		if (submittedForm) {
			return;
		}
		const response = await fetch(
			`/api/check/checkDuplicateBooking?student_id=${encodeURIComponent(
				data.selected_student,
			)}&selected_class=${encodeURIComponent(data.selected_class)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (response.ok) {
			const { hasBooking } = await response.json();

			if (hasBooking) {
				setAlreadyBooked(true);
				console.error("Student already has a booking for this class.");
			} else {
				setSubmittedForm(true);
				fetch("/api/store/storeBooking", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}).then((response) => {
					if (response.ok) {
						router.push("/bookings").catch((error) => {
							console.error(`Error navigating to bookings page:${error}`);
						});
					} else {
						console.error("Error storing booking:", response);
					}
				});
			}
		} else {
			console.error("Error checking for existing booking:", response);
		}
	};

	useEffect(() => {
		const uniqueClasses = uniqueByIdAndName(classes);
		setUniqueClasses(uniqueClasses);

		if (!classTitle) {
			return;
		}
		form.setValue("selected_class", classTitle);
	}, [classTitle, form]);

	if (usersStudents === undefined) {
		return (
			<div className="flex flex-col justify-center py-2 border border-white rounded-lg p-10">
				<h1 className="text-4xl font-bold text-white flex justify-center p-10">
					Booking Form
				</h1>
				<h1 className={"text-3xl flex justify-center"}>Loading students...</h1>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center py-2 border border-white rounded-lg p-10">
			<h1 className="text-4xl font-bold text-white flex justify-center p-10">
				Booking Form
			</h1>
			{usersStudents.length === 0 ? (
				<>
					<h1 className={"text-3xl flex justify-center"}>
						No registered students found.
					</h1>
					<br />
					<div className={"p-10"}>
						<Link href={"/students/new"} className={"flex justify-center"}>
							<Button className={"w-[40%] text-xl"}>Register a student</Button>
						</Link>
					</div>
				</>
			) : (
				<div className={"p-8"}>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-2/3 space-y-6"
						>
							<FormField
								control={form.control}
								name="selected_class"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Class</FormLabel>
										<Popover open={classOpen} onOpenChange={setClassOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[200px] justify-between",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value
															? uniqueClasses.find(
																	(classes) => classes.id === field.value,
															  )?.name
															: classTitle}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0 overflow-y-auto max-h-[30rem]">
												<Command>
													<CommandInput placeholder="Search classes..." />
													<CommandEmpty>No class found.</CommandEmpty>
													<CommandGroup>
														{uniqueClasses.map((classes) => (
															<CommandItem
																value={classes.id}
																key={classes.id}
																onSelect={() => {
																	form.setValue("selected_class", classes.id);
																	setClassOpen(false);
																	router
																		.push(`/bookings/new?class=${classes.id}`)
																		.catch((error) => {
																			console.error(
																				`Error navigating to new booking page:${error}`,
																			);
																		});
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		classes.id === field.value
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
																{classes.name}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="selected_student"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Student</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a student for this class" />
												</SelectTrigger>
											</FormControl>
											<SelectContent
												className={"overflow-y-auto max-h-[30rem]"}
											>
												{usersStudents.map((student) => (
													<SelectItem
														key={student.student_id}
														value={student.student_id.toString()}
													>
														{`${student.student_first_name} ${student.student_last_name}`}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Submit</Button>
						</form>
					</Form>
				</div>
			)}
			<Dialog open={alreadyBooked} onOpenChange={setAlreadyBooked}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className={"flex justify-center"}>
							Booking already exists
						</DialogTitle>
					</DialogHeader>

					<div className={"p-8"}>
						<p className={"flex justify-center"}>
							This student is already booked for this class.
						</p>
						<br />
						<div className={"flex justify-center"}>
							<Button onClick={() => setAlreadyBooked(false)}>Close</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default NewBookingForm;
