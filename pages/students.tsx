import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { students } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Students() {
	const { userId } = useAuth();
	const router = useRouter();
	const [userStudents, setUserStudents] = useState<students[]>([]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		const fetchStudents = async () => {
			try {
				const data = await fetch(
					`/api/fetch/getAllUsersStudents?user_id=${userId}`,
				);
				const students = await data.json();
				setUserStudents(students);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchStudents().catch((error) => {
			console.error("Error fetching students:", error);
		});
	}, [userId]);

	return (
		<>
			<Head>
				<title>Virtue Movement - Your Students</title>
				<meta name="description" content="Virtue Movement" />
			</Head>
			<SignedIn>
				<br />
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50 flex justify-center">
					Current Students
				</h1>
				<br />
				<Separator />
				<Button
					variant={"ghost"}
					className={"w-[100%] m-auto"}
					size={"lg"}
					onClick={() => {
						router.push("/students/new").catch((error) => {
							console.error("Error navigating to new students page:", error);
						});
					}}
				>
					Add New Student
				</Button>
				<br />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-8 h-[25vh]">
					{userStudents.map((student, index) => (
						<Link
							href={`/students/${student.student_id}`}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
						>
							<Card>
								<CardHeader>
									<CardTitle>
										<p>
											{student.student_first_name} {student.student_last_name}
										</p>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										<span className="font-semibold">Student First Name:</span>{" "}
										{student.student_first_name}
									</p>
									<p>
										<span className="font-semibold">Student Last Name:</span>{" "}
										{student.student_last_name}
									</p>
									<p>
										<span className="font-semibold">
											Student Date Of Birth:
										</span>{" "}
										{student.student_dob
											? new Date(student.student_dob).toLocaleDateString(
													"en-GB",
											  )
											: "N/A"}
									</p>
									<p>
										<span className="font-semibold">Address:</span>{" "}
										{student.address1} {student.address2}, {student.city},{" "}
										{student.county}, {student.postcode}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</SignedIn>
			<SignedOut>
				<div className={"flex justify-center"}>
					<h1 className={"text-2xl text-white "}>
						Please sign in to view your registered students
					</h1>
				</div>
			</SignedOut>
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
		</>
	);
}

export default Students;
