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
                            <button @click="" class="create-new-notes-box add"><p>✓</p></button>
                        </div>
                    </div>
                    <div class="create-new-notes-box input-box">
                        <input class="input-box name " type="text" placeholder="Имя заметки">
                        <input v-for="item in inputCount" type="text" :placeholder='inputPlaceholder(item)'>
                    </div>
                </div>
            </div>
            <div class="tabs">
                <h2 style="color: red">Начато</h2>
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
            notesTask: {
                task1: null,
                task2: null,
                task3: null,
                task4: null,
                task5: null,
            },
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
            if (!this.name) {
                this.name = 'Имя заметки'
            }
            //вот тут продолжить
        }
    },
})

let app = new Vue({
    el: '#app',
})