export interface Skill {
    name: string;
}

export interface Person {
    fullName: string;
    age: number;
    skills: Skill[];
}

export interface Task {
    name: string;
    dueDate: Date;
    completed: boolean;
    persons: Person[];
}