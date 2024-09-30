import { Component } from '@angular/core';
import { Task } from 'src/app/models/models';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => {
      debugger
      this.tasks = tasks;
      console.log('Lista de skills: ', this.tasks[0].persons[0].skills[0]);
    });
  }

  toggleCompletion(index: number) {
    this.taskService.toggleTaskCompletion(index);
  }
}
