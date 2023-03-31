import { Component, OnInit, HostListener } from '@angular/core';
import * as questionsData from  '../assets/round1.json'
import { CountdownEvent } from "ngx-countdown";
import { Console } from 'console';

export interface Question {
  question : string;
  picture : string;
  variant1 : string;
  variant2 : string;
  variant3 : string;
  variant4 : string;
  answer : string;
  explanation : string;
  status : string;
  token : string;
  id : string
}

export interface Prise {
  value : string;
  status : string;
  id : string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'millioner1';
  id! : string;
  number! : number;
  prize! : number;
  is_question! : boolean
  continue! : boolean
  time_index : number = 0
  timeData = '45'
  config:any;
  timer : string = 'timer'
  token! : string //= 'dlvrtlk3103'
  tokens : Array<string> = [];
  questions : Question [] = []
  questionsData : Question [] = []
  start_game : boolean = true
  message : string = ''


  constructor(){
    this.continue = false  
    this.number = 0
    this.config = {leftTime: this.timeData, demand:true};
    this.id = ''
    this.prize = 0
    this.start()
    this.is_question = true
    this.stop()
    this.token = ''
    this.message  = ''
  }

  start(){
    this.config = {leftTime:this.timeData, demand:false};
  }
  stop(){
    this.config = {leftTime:this.timeData, demand:true};
  }
  handleEvent(event : CountdownEvent): void {

    this.time_index ++
      if (this.time_index >= 2 && event.action=='done') {
      this.getAnswer(this.timer, 'variant')
    }
  }

   game : Question [] = questionsData;

  ngOnInit() {
    for(let i = 0; i < this.game.length; i++){
      this.questionsData.push(this.game[i])
      if(!this.tokens.includes(this.game[i].token)) {
        this.tokens.push(this.game[i].token)
      }
    }
  }

  prise_bar : Prise [] = [
    {value : '100$', status : 'no-passed', id : 'prize_100'},
    {value : '200$', status : 'no-passed', id : 'prize_200'},
    {value : '300$', status : 'no-passed', id : 'prize_300'},
    {value : '400$', status : 'no-passed', id : 'prize_400'},
    {value : '500$', status : 'no-passed', id : 'prize_500'},
    {value : '1000$', status : 'no-passed', id : 'prize_1000'},
    {value : '2000$', status : 'no-passed', id : 'prize_2000'},
    {value : '4000$', status : 'no-passed', id : 'prize_4000'},
    {value : '8000$', status : 'no-passed', id : 'prize_8000'},
    {value : '16000$', status : 'no-passed', id : 'prize_16000'},
    {value : '32000$', status : 'no-passed', id : 'prize_32000'},
    {value : '64000$', status : 'no-passed', id : 'prize_64000'},
    {value : '125000$', status : 'no-passed', id : 'prize_125000'},
    {value : '250000$', status : 'no-passed', id : 'prize_250000'},
    {value : '500000$', status : 'no-passed', id : 'prize_500000'},
    {value : '1000000$', status : 'no-passed', id : 'prize_1000000'}
  ]

  idOnInit : string[] = ['variant1', 'variant2', 'variant3', 'variant4']

  autorizeMode(event:any) {
    this.token = event.target.value
    console.log(event)
  }

  restartGame(){
    window.location.reload();
    document.getElementById('autorization')?.scrollIntoView({behavior:"smooth"});
    let game = document.getElementById('game')?.classList
    game?.remove('active')
    this.stop()
  }

  startGame(){
    if(this.tokens.includes(this.token)) {

      for(let i = 0; i < this.questionsData.length; i++) {
        if(this.questionsData[i].token == this.token) {
          this.questions.push(this.questionsData[i])
        }
      }
        document.getElementById('game')?.scrollIntoView({behavior:"smooth"});
        this.start_game = true
        let game = document.getElementById('game')?.classList
        game?.add('active')
        this.start()
    }
    else {
      this.message = 'The password is incorrect. Repeat entering or contact your manager.'
     }
   }

  nextQuestion() {
    this.idOnInit.forEach(element => {
      let question = document.getElementById(element)?.classList
      question?.remove('passed')
      question?.remove('no-passed')
    })
    this.continue = false
    this.is_question = true
    this.start()
    this.number += 1
  }

  getAnswer(answer : string, id : string) {

    //START
    this.stop()
    let status : string

    ///TIMER
    if (answer === 'timer') {
      document.getElementById('continue')?.scrollIntoView({behavior:"smooth"});
      status = 'no-passed'
      for(let i = 0; i <= this.prize; i++) {
        let prize = document.getElementById(this.prise_bar[i].id)?.classList
        prize?.remove('passed')
        this.prise_bar[i].status = 'no-passed'
      }
      this.id = this.questions[this.number].id
      status = 'passed'
      this.is_question = false
      this.prize = 0
    }

    ///OK
    else if (answer === this.questions[this.number].answer) {
      this.questions[this.number].status = status = this.prise_bar[this.prize].status = 'passed'
      let prize = document.getElementById(this.prise_bar[this.prize].id)?.classList
      prize?.add(status)
      this.prize ++
      this.id = id
      this.is_question = true
      
    }

    ////NO
    else {
      status = 'no-passed'
      for(let i = 0; i <= this.prize; i++) {
        let prize = document.getElementById(this.prise_bar[i].id)?.classList
        prize?.remove('passed')
        this.prise_bar[i].status = 'no-passed'
      }
        this.prize = 0
        this.id = id
        this.is_question = false
        let question = document.getElementById(this.questions[this.number].id)?.classList
        question?.add('passed')  
    }

    //END
    let question = document.getElementById(this.id)?.classList
    question?.add(status)  
    this.continue = true 
    
    if (!this.questions[this.number + 1]){
      this.prize --
      this.start_game = false
      console.log('stop')
      this.stop()
      }
    }
}
