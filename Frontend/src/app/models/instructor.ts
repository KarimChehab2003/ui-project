export class Instructor {
    constructor (
        public id : number,
        public name: String,
        public email : String,
        public password : String,
        public coursesIds : number []
    ){}
}