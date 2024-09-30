import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {

  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      dueDate: ['', Validators.required],
      persons: this.fb.array([]),
    });
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addPerson() {
    const personsGroup = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5), this.validateUniqueName.bind(this)]],
      age: [null, [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', Validators.required)]),
    });

    this.persons.push(personsGroup);
  }

  validateUniqueName(control: AbstractControl): ValidationErrors | null {
    debugger
    const persons = this.persons.controls;
    const fullName = control.get('fullName')?.value;
  
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].get('fullName')?.value === fullName) {
        return { duplicateName: true }; // Return an object with the error key
      }
    }
  
    return null; // No duplicate names found
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  getSkills(personIndex: number) {
    return (this.persons.at(personIndex).get('skills') as FormArray);
  }

  addSkill(personIndex: number) {
    this.getSkills(personIndex).push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    this.getSkills(personIndex).removeAt(skillIndex);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task = {
        ...this.taskForm.value,
        completed: false
      };
      this.taskService.addTask(task);
      this.taskForm.reset();
      this.persons.clear();
    }
  }
}
