import { Component } from '@angular/core';
import { Skill, Task } from 'src/app/models/models';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  tasks: Task[] = [];
  filteredTasks: Task[] = this.tasks;
  currentFilter: string = 'all';

  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = this.tasks;
      this.applyFilter();
    });
  }

  toggleCompletion(index: number) {
    console.log('Tasks', this.tasks);
    console.log('filterTasks', this.filteredTasks);

    this.taskService.toggleTaskCompletion(index);
    this.applyFilter();
  }

  joinSkills(listSkills: Skill[]) {
    return listSkills.join(', ');
  }

  filterTasks(status: string) {
    if (status === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.completed === (status === 'completed'));
    }
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredTasks = this.tasks;
    } else if (this.currentFilter === 'completed') {
      this.filteredTasks = this.tasks.filter(task => task.completed);
    } else {
      this.filteredTasks = this.tasks.filter(task => !task.completed);
    }
  }
}
