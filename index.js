//Todo CLI App
// Create a todo
// delete a todo
// mark todo as done

const fs  = require('fs')
const path = require('path')
const { Command } = require('commander')
const program = new Command();

let todoDict = new Object();
let mainArray = [];

let ctr = 1
program
    .name('Todo CLI')
    .description('CLI for daily Todos');

function createNewTaskFile(taskStr) {
    todoDict["id"] = ctr;
    todoDict["task"] = taskStr;
    let todoJson = JSON.stringify(mainArray);
    fs.writeFile('todo.json',todoJson,err => {
        if(err) {
            throw err;
        } else {
            console.log("New todo added");
        }
        });

}


//Function to update the index of tasks in todo list after new or done operation
function updateIndex() {
    for(let i =0;i<mainArray.length;i++) {
        mainArray[i]["id"] = i+1;
    }
}

program.command('new')
    .description('Create a new todo')
    .argument('<string>','New todo task (put in inverted commas)')
    .action( (str) => {
        mainArray.push(todoDict);
            fs.readFile('todo.json','utf-8',( err,data) => {
            if(err) {
                if(err.code === "ENOENT") {
                    createNewTaskFile(str);
                } else {
                    throw err;
                }
            } else {    
            
            let mainArray = JSON.parse(data);
            if(mainArray.length === 0) {
                createNewTaskFile(str);
                
            } else {
                let lastObject = mainArray[mainArray.length - 1];
                let newKey = parseInt(lastObject["id"]) + 1;
                todoDict["id"] = newKey;
                todoDict["task"] = str;
                mainArray.push(todoDict);
            
                fs.writeFile('todo.json',JSON.stringify(mainArray),err => {
                    if(err)
                        throw(err);
                    else
                        console.log("New todo added");
                    });
            }
        
            }
            });       
    })

program.command('view')
    .description('View Todo List')
    .action( () => {
        console.log('This is your todo list');
        fs.readFile('todo.json','utf-8',(err,data) => {
            if(err){
                if(err.code === "ENOENT") {
                    console.log("No Todos Exist");
                } else {
                    throw err;
                }
            }

            let mainArray = JSON.parse(data);
            for (let i = 0;i<mainArray.length;i++) {
                console.log(mainArray[i]["id"] + "." + mainArray[i]["task"]);

            }

        })
    })

program.command('done')
    .description('Mark task as done')
    .argument('<int>','Task Number')
    .action( (taskId) => {
        let idToDelete = parseInt(taskId);

        fs.readFile('todo.json','utf-8',(err,data) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    console.log("No Tasks exist");
                } else {
                    throw err;
                }
            }
            else {
                mainArray = JSON.parse(data);
                let taskExist = false;
                let newKey  = 1;
                for (let i = 0;i<mainArray.length;i++) {
                    if(parseInt(mainArray[i]["id"]) === idToDelete){
                        taskExist = true;
                        mainArray = mainArray.filter(item => item.id !== idToDelete);
                        updateIndex();
                        let todoJson = JSON.stringify(mainArray);
                        fs.writeFile('todo.json',todoJson,err => {
                            if(err) {
                                throw err;
                            } else {
                                console.log("Task deleted!");
                            }
                        });
                    } else {newKey = newKey + 1};
                }
                if(!taskExist) {
                    console.log("No such task exists");
                }
            }
        })
    })

program.parse();