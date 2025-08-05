export interface Task {
  id: string;
  title: string;
  description:string;
  assignee: string;
  assignedTo: string;
  dueDate: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "To Do" | "In Progress" | "Need Review" | "Done";
  comments: string;
}
