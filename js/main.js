let eventBus = new Vue()

Vue.component('notes', {
    template: `
        <div>
            <h1>Заметки</h1>    
            <div v-show="!displayCreateNewNotes" @click="displayCreateNewNotes = true" class="create-new-notes-button">
                <p>Создать новую заметку</p>
            </div>
            <div v-show="displayCreateNewNotes" class="create-new-notes-box">
                <p>Создание новой заметки</p>
                <p v-show="errors" style="margin: 20px 0">{{errors}}</p>
                <div class="create-new-notes-box content">
                    <div class="create-new-notes-box button">
                        <div class="create-new-notes-box button-input">
                            <button @click="addInput" class="create-new-notes-box add-new-input"><p>+</p></button>
                            <button @click="removeInput" class="create-new-notes-box add-new-input"><p>-</p></button>
                        </div>
                        <div class="button-input">
                            <button @click="displayCreateNewNotes = false" class="create-new-notes-box exit"><p>X</p></button>
                            <button @click="notesSave" class="create-new-notes-box add"><p>✓</p></button>
                        </div>
                    </div>
                    <div class="create-new-notes-box input-box">
                        <input v-model="notesName" class="input-box name " type="text" placeholder="Имя заметки">
                        <input v-for="item in inputCount" type="text" :placeholder='inputPlaceholder(item)' v-model="notesTask[item]">
                    </div>
                </div>
            </div>
            <div class="tabs">
                <div><h2 style="color: red">Начато</h2>
                <div class="card" v-for="item in notes" v-if="item.notesProcess === 'new'">
                    <h3>{{item.name}}</h3>
                    <div>
                    </div>
                </div></div>
                <h2 style="color: orange">Еще чуть чуть</h2>
                <h2 style="color: green">Выполнено</h2>
            </div>
        </div>
    `,
    data() {
        return {
            notes: [],
            inputCount: 3,
            errors: null,
            displayCreateNewNotes: false,

            notesName: null,
            notesTask: ['','','','',''],
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

            if (countNewNote < 3) {
                if (!this.name) {
                    this.notesName = 'Имя заметки';
                }

                let newNotes = {
                    name: this.notesName,
                    notes: [],
                    notesProcess: 'new'
                };

                for (let i = 1; i < this.inputCount + 1; i++) {
                    if (this.notesTask[i]) {
                        newNotes.notes.push(this.notesTask[i]);
                        this.notesTask[i] = null;
                    } else {
                        newNotes.notes.push('Задача без имени');
                    }
                }

                this.notes.push(newNotes);
                console.log(this.notes);
                this.notesName = null;
            } else {
                this.errors = 'у вас больше трех начатых заметок';
            }
        },
    },
})

let app = new Vue({
    el: '#app',
})