import { Injectable } from '@angular/core';
import { Task } from '../models/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];
  // private tasks: Task[] = [
  //   {
  //     name: 'Build Angular App',
  //     dueDate: new Date('2024-10-10'),
  //     completed: false,
  //     persons: [
  //       {
  //         fullName: 'John Doe',
  //         age: 28,
  //         skills: ['JavaScript','Angular']
  //       },
  //       {
  //         fullName: 'Jane Smith',
  //         age: 35,
  //         skills: ['TypeScript','CSS']
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Prepare Documentation',
  //     dueDate: new Date('2024-09-30'),
  //     completed: true,
  //     persons: [
  //       {
  //         fullName: 'Alice Johnson',
  //         age: 40,
  //         skills: ['Technical Writing', 'Markdown' ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Fix Bugs',
  //     dueDate: new Date('2024-11-01'),
  //     completed: false,
  //     persons: [
  //       {
  //         fullName: 'Bob Brown',
  //         age: 30,
  //         skills: ['Debugging', 'Testing' ]
  //       }
  //     ]
  //   }
  // ];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksSubject.next([...this.tasks]);
  }

  toggleTaskCompletion(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.tasksSubject.next([...this.tasks]);
  }
}
