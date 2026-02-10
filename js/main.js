let eventBus = new Vue()

Vue.component('notes', {
    template: `
        <div>
            <h1>Заметки</h1>    
            <div v-show="!displayCreateNewNotes" @click="displayCreateNewNotes = true" class="create-new-notes-button">
                <p>Создать новую заметку</p>
            </div>
            <div v-if="displayCreateNewNotes" class="modal-overlay" @click.self="displayCreateNewNotes = false">
                
                <div class="create-new-notes-box-back">
                    <p class="modal-title">Создание новой заметки</p>
                    <p v-show="errors" style="margin: 20px 0; color: red;">{{errors}}</p>
                    
                    <div class="create-new-notes-box-content">
                        <div class="create-new-notes-box-button">
                            <div class="create-new-notes-box-button-input">
                                <button @click="addInput" class="create-new-notes-box-add-new-input"><p>+</p></button>
                                <button @click="removeInput" class="create-new-notes-box-add-new-input"><p>-</p></button>
                            </div>
                            <div class="create-new-notes-box-button-input">
                                <button @click="displayCreateNewNotes = false" class="create-new-notes-box-exit"><p>X</p></button>
                                <button @click="notesSave" class="create-new-notes-box-add"><p>✓</p></button>
                            </div>
                        </div>
                        
                        <div class="create-new-notes-box input-box">
                            <input v-model="notesName" class="input-box-name" type="text" placeholder="Имя заметки">
                            <input v-for="item in inputCount" :key="item" type="text" :placeholder="inputPlaceholder(item)" v-model="notesTask[item]">
                        </div>
                        
                        <input v-model="notesColor" type="color" class="create-new-notes-box color-picker">
                    </div>
                </div>
            </div>
            <div class="tabs">
                <div style="position: relative">
                <h2 style="color: red">Начато</h2>
                <div class="taskblock" v-show="disableFirstColumns === true" :style="notes.color"><p>У вас заблокированы задачи</p></div>
                <div :style="{borderColor: item.notesColor}" class="card" v-for="item in notes" v-if="item.notesProcess === 'new'">
                    <h3>{{item.name}}</h3>
                    <div class="card-notes">
                        <p v-for="i in item.notes" @click="(!i.complete ? checkOnFree(item, i) : '')" :style="(i.complete ? 'background-color: lightgreen; transition: 0.2s; cursor: default;' : '')">{{i.name}}</p>
                    </div>
                </div>
                </div>
                <div><h2 style="color: orange">еще чуть чуть</h2>
                <div :style="{borderColor: item.notesColor}" class="card" v-for="item in notes" v-if="item.notesProcess === 'progress'">
                    <h3>{{item.name}}</h3>
                    <div class="card-notes">
                        <p v-for="i in item.notes" @click="(!i.complete ? note(item, i) : errors='у вас заполнены столбцы')" :style="(i.complete ? 'background-color: lightgreen; transition: 0.2s; cursor: default;' : '')">{{i.name}}</p>
                    </div>
                </div></div>
                <div><h2 style="color: green">выполненые</h2>
                <div :style="{borderColor: item.notesColor}" class="card" v-for="item in notes" v-if="item.notesProcess === 'complete'">
                    <h3>{{item.name}}</h3>
                    <div class="card-notes">
                        <p :style="(i.complete ? 'background-color: lightgreen; transition: 0.2s; cursor: default;' : '')" v-for="i in item.notes" >{{i.name}}</p>
                    </div>
                    <p style="color: gray">{{item.notesDate}}</p>
                </div></div>
            </div>
        </div>
    `,
    data() {
        return {
            notes: [],
            inputCount: 3,
            errors: null,
            displayCreateNewNotes: false,
            disableFirstColumns: false,

            notesName: null,
            notesColor: null,
            notesTask: ['','','','',''],
        }
    },
    watch: {
        disableFirstColumns(item) {
            if (item === false) {
                this.moveEligibleNotes();
            }
        }
    },
    methods: {
        inputPlaceholder(item) {
            return 'task: ' + item;
        },
        addInput() {
            if (this.inputCount < 5) {
                this.inputCount += 1;
            }
            else {
                this.errors = 'В заметке может быть максимум 5 задач';
            }

        },
        removeInput() {
            if (this.inputCount > 3) {
                this.inputCount -= 1;
            }
            else {
                this.errors = 'В заметке не может быть меньше 3 задач';
            }
        },
        notesSave() {
            let countNewNote = 0;
            for (let item of this.notes) {
                if (item.notesProcess === 'new') {
                    countNewNote++;
                }
            }

            if (countNewNote < 3 && this.disableFirstColumns === false) {
                if (!this.name) {
                    this.notesName = 'Имя заметки';
                }

                let newNotes = {
                    name: this.notesName,
                    notes: [],
                    notesProcess: 'new',
                    notesDate: null,
                    notesColor: this.notesColor,
                };

                for (let i = 1; i < this.inputCount + 1; i++) {
                    if (this.notesTask[i]) {
                        let newPin = {
                            name: this.notesTask[i],
                            complete: false,
                        };
                        newNotes.notes.push(newPin);
                        this.notesTask[i] = null;
                        this.notesColor = null;
                    } else {
                        let newPin = {
                            name: 'Задача без имени',
                            complete: false,
                            notesColor: '#000000'
                        };
                        newNotes.notes.push(newPin);
                    }
                }

                this.notes.push(newNotes);
                console.log(this.notes);
                this.notesName = null;
            } else {
                this.errors = 'у вас больше трех начатых заметок';
            }
        },
        note(notes, item) {
            if (item.complete) {}
            else item.complete = true;
            let sum = 0.0;
            for (let i = 0; i < notes.notes.length; i++) {
                if(notes.notes[i].complete === true) {sum++}
            }
            console.log(sum);
            let progressNotesCount = this.notes.filter(n => n.notesProcess === 'progress').length;

            if (sum / notes.notes.length > 0.5 && progressNotesCount <= 4)
            {notes.notesProcess = 'progress'}
            if (sum / notes.notes.length === 1 ) {notes.notesProcess = 'complete'}

            console.log(sum /notes.notes.length);
            sum = 0.0;
            this.disableFirstColumns = false;
            notes.notesDate = Date();
            console.log(notes.notesDate + ' ' + Date.now());
            this.saveData()
        },
        moveEligibleNotes() {
            let progressNotesCount = this.notes.filter(n => n.notesProcess === 'progress').length;
            this.notes.forEach(note => {
                if (note.notesProcess === 'new') {
                    let completedCount = note.notes.filter(task => task.complete).length;
                    let percent = completedCount / note.notes.length;

                    if (percent >= 0.5 && progressNotesCount < 5) {
                        note.notesProcess = 'progress';
                        progressNotesCount++;
                    }
                }
            });
            this.saveData();
        },
        checkOnFree(item, i) {
            let progressNotesCount = this.notes.filter(n => n.notesProcess === 'progress').length;
            let sum = 0.0;
            for (let j = 0; j < item.notes.length; j++) {
                if(item.notes[j].complete === true) {sum++}
            }
            console.log(sum);

            if (progressNotesCount < 5) {
                this.note(item, i);
                this.errors = null;
                this.displayCreateNewNotes = true;
                this.disableFirstColumns = false;
            } else {
                this.errors = 'Во втором столбце не может быть больше 5 заметок';
                if (sum / item.notes.length <= 0.5) {
                    this.note(item, i);
                } else {
                    this.disableFirstColumns = true;
                }
            }
            if (this.disableFirstColumns === false && sum / item.notes.length > 0.5 && item.notesProcess === 'new') {
                item.notesProcess = 'progress';
            }
        },
        saveData() { localStorage.setItem('notes', JSON.stringify(this.notes)) }
    },
    mounted() {
        const savedNotes = localStorage.getItem('notes');
        this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    }
})

let app = new Vue({
    el: '#app',
})