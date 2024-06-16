#!  /usr/bin/env node
import inquirer from 'inquirer';
class Course {
    name;
    fee;
    constructor(name, fee) {
        this.name = name;
        this.fee = fee;
    }
}
class Student {
    static idCounter = 0;
    id;
    name;
    courses = [];
    balance = 1000;
    constructor(name) {
        this.id = this.generateID();
        this.name = name;
    }
    generateID() {
        const id = (Student.idCounter++).toString().padStart(5, '0');
        return id;
    }
    enroll(course) {
        this.courses.push(course);
        this.balance += course.fee;
    }
    viewBalance() {
        return this.balance;
    }
    payTuition(amount) {
        if (amount > this.balance) {
            console.log('Insufficient balance.');
        }
        else {
            this.balance -= amount;
            console.log('Payment successful.');
        }
    }
    showStatus() {
        console.log(`\nStudent ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log('Courses Enrolled:');
        this.courses.forEach(course => console.log(`  - ${course.name} (${course.fee} USD)`));
        console.log(`Balance: ${this.balance} USD\n`);
    }
}
const courses = [
    new Course('Mathematics', 300),
    new Course('Science', 400),
    new Course('Literature', 200)
];
let students = [];
async function displayMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            choices: [
                'Add a new student',
                'Enroll in a course',
                'View balance',
                'Pay tuition fees',
                'Show status',
                'Exit'
            ]
        }
    ]);
    switch (answers.option) {
        case 'Add a new student':
            await addStudent();
            break;
        case 'Enroll in a course':
            await selectStudent(enrollInCourse);
            break;
        case 'View balance':
            await selectStudent(viewBalance);
            break;
        case 'Pay tuition fees':
            await selectStudent(payTuition);
            break;
        case 'Show status':
            await selectStudent(showStatus);
            break;
        case 'Exit':
            process.exit();
    }
    displayMenu();
}
async function addStudent() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the student:'
        }
    ]);
    const student = new Student(answers.name);
    students.push(student);
    console.log(`Added student: ${student.name}, ID: ${student['id']}`);
}
async function selectStudent(callback) {
    if (students.length === 0) {
        console.log('No students available. Please add a student first.');
        return;
    }
    const studentChoices = students.map((student, index) => ({
        name: `${student['id']} - ${student['name']}`,
        value: index
    }));
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'studentIndex',
            message: 'Select a student:',
            choices: studentChoices
        }
    ]);
    const student = students[answers.studentIndex];
    await callback(student);
}
async function enrollInCourse(student) {
    const courseChoices = courses.map((course, index) => ({
        name: `${course.name} (${course.fee} USD)`,
        value: index
    }));
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'courseIndex',
            message: 'Choose a course to enroll:',
            choices: courseChoices
        }
    ]);
    const course = courses[answers.courseIndex];
    student.enroll(course);
    console.log(`Enrolled in ${course.name}.`);
}
async function viewBalance(student) {
    console.log(`Balance: ${student.viewBalance()} USD`);
}
async function payTuition(student) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount to pay:',
            validate: input => {
                const amount = parseFloat(input);
                if (isNaN(amount) || amount <= 0) {
                    return 'Please enter a valid amount greater than zero.';
                }
                return true;
            }
        }
    ]);
    student.payTuition(parseFloat(answers.amount));
}
async function showStatus(student) {
    student.showStatus();
}
displayMenu();
