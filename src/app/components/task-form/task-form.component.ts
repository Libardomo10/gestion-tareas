import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
      persons: this.fb.array([], this.validatePersonsArray())
    });
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addPerson() {
    const personsGroup = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5), this.validateUniqueName()]],
      age: [null, [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', Validators.required)]),
    });

    this.persons.push(personsGroup);
  }

  validateUniqueName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Verificamos que control.parent y control.parent?.parent no sean null
      if (!control.parent || !control.parent.parent) {
        return null;
      }

      const formArray = control.parent.parent as FormArray; // Obtenemos el FormArray que contiene todas las personas
      const currentFullName = control.value?.trim().toLowerCase(); // Valor actual del campo de nombre

      if (!formArray || !currentFullName) {
        return null; // Si no hay array o no hay valor en fullName, no hay validación que aplicar
      }

      const currentIndex = formArray.controls.indexOf(control.parent); // Obtenemos el índice del control actual

      // Recorremos todos los controles dentro del FormArray
      for (let i = 0; i < formArray.length; i++) {
        if (i !== currentIndex) { // Nos aseguramos de no comparar con el control actual
          const otherFullName = formArray.at(i).get('fullName')?.value?.trim().toLowerCase();
          if (otherFullName === currentFullName) {
            return { duplicateName: true }; // Devolver un error si encontramos un duplicado
          }
        }
      }

      return null; // No se encontraron duplicados
    };
  }

  validatePersonsArray(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const personsArray = control as FormArray;
      if (personsArray.length === 0) {
        return { noPersons: true }; // Error si no hay personas
      }

      for (let person of personsArray.controls) {
        const skills = person.get('skills') as FormArray;
        if (skills.length === 0) {
          return { noSkills: true }; // Error si alguna persona no tiene habilidades
        }
      }

      return null; // Si no hay errores
    };
  }


  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  getSkills(personIndex: number) {
    return (this.persons.at(personIndex).get('skills') as FormArray);
  }

  addSkill(personIndex: number) {
    const skills = this.persons.at(personIndex).get('skills') as FormArray;
    skills.push(this.fb.control('', Validators.required));
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
