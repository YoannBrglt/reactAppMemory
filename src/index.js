import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import './index.css';
import listImg from './listImage.json';


class Square extends React.Component {
   
    render() {
<<<<<<< Updated upstream
        
        

      return (
        <button className="square" onClick={() => this.props.updateBoard(this.props.index)}>

          {this.props.square.etat === 0 ? "?" : this.props.square.etat ===2 ? null : this.props.square.value}
=======
      const card="https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/placeholder-1c66220c6149b49352c4cf496f70ad86.jpg"
      return (
        <button className={`square ${this.props.square.etat===0 ? "pointer" :"" }`} onClick={() => this.props.updateBoard(this.props.index)}>
          {this.props.square.etat === 0 ? 
          <img src={card} alt="new" width="125" heigth="125"></img>
           : this.props.square.etat ===2 ? null : this.props.square.value}
>>>>>>> Stashed changes
        </button>
      );
    }
  }
  
  class Board extends React.Component {
        constructor(props) {
            super(props);
<<<<<<< Updated upstream
            const width = this.props.lengthSelect.width
            const heigth = this.props.lengthSelect.height
            const nbImage=width*heigth%2 ==0 ? width*heigth : width*heigth-1
            console.log(this.props.lengthSelect.w)
            console.log(nbImage)
=======
            const width = this.props.width
            const height = this.props.height
            
            const nbImage=width*height%2 ==0 ? width*height : width*height-1
          
            console.log(listImg[0]["name"])
>>>>>>> Stashed changes
            const arrayNbImage=[]
            const arrayImage=[]
            const arrayNumber=[]
            console.log(selectRandom(2,listImg))

            for(let i = 0; i< nbImage; i++){
              arrayNumber.push(i)
              if( i < nbImage/2){
                arrayNbImage.push(i)
              }
              if( i>= nbImage/2){
                arrayNbImage.push(i-(nbImage/2))
              }
            }

            shuffleArray(arrayNbImage)
            const testTable=[]
            const table = (testTable) => arrayNumber.map(x => testTable.push({id: x, value: arrayNbImage[x] , etat: 0})) 
            table(testTable)
            
            this.state = {
                table : testTable,
                player : [
                    {id:0,name:"joueur 1",score:0},
                    {id:1,name:"joueur 2",score:0}
                    ],
                currentPlayer : {id:0}
            };
        }
    updateBoard(i) {
        this.setState((prevstate,props) => {
            const newState=Object.assign({},prevstate)
            const etatTable = prevstate.table.filter(x => x.etat === 1);
            const validateTable = prevstate.table.filter(x=>x.etat === 2);
            if (calculateEndgame(prevstate.table)){
                console.log("you win")
            }
            if (etatTable.length<1){
                // first Move
                if (prevstate.table[i].etat === 2){
                  return newState
                }
                newState.table[i].etat=1;

            } else if (etatTable.length === 1){
                // second Move
                if (prevstate.table[i].etat === 2){
                  return newState
                }
                if(prevstate.table[i].etat === 1){
                    return newState
                } else {
                    newState.table[i].etat=1;
                }
              }else{
                return this.validateClick(prevstate)
            }
            return newState
        })

    }
    waitingResult(prevstate){
      new Promise(resolve => {
        setTimeout(this.validateClick(prevstate), 2000);
      });
    }
    validateClick(prevstate) {
        const newState=Object.assign({},prevstate)
        const etatTable = prevstate.table.filter(x => x.etat === 1);

        if (etatTable[0].value===etatTable[1].value){
            //win this cards
            
            newState.table[etatTable[0].id].etat= 2
            newState.table[etatTable[1].id].etat= 2
            this.incrementScore(newState,3)
        }else {
            //loose next player

            newState.table[etatTable[0].id].etat=0
            newState.table[etatTable[1].id].etat=0
            const newStateIncremented= this.incrementScore(newState,-1)
            console.log(newState.currentPlayer.id,"juste avant")
            const nextTurnNewState = this.playerTurn(newStateIncremented,1) ;
           
            return nextTurnNewState

        }
        return newState
    }

    playerTurn(prevstate){
        // increment by one the id of player 
        const newState=Object.assign({},prevstate)
        const len=newState.player.length;
        
        if (prevstate.currentPlayer.id === prevstate.player[len-1].id ){
            newState.currentPlayer.id = prevstate.player[0].id 
        }else {
            console.log("current",newState.currentPlayer.id)
            newState.currentPlayer.id = prevstate.currentPlayer.id + 1;  
        }
        return newState
    }
    incrementScore(prevstate,point){
        const newState=Object.assign({},prevstate)
        
        newState.player[newState.currentPlayer.id].score = newState.player[newState.currentPlayer.id].score + point;
        return newState
    }

    renderSquare(i) {
      return <Square square={this.state.table[i]} index={i} idJoueur= {this.state.currentPlayer.id} updateBoard= {() => this.updateBoard(i)} />;
    }
    createLine(i,width,height){
      const renderTable=[]
      const nbCard=width*height%2 ==0 ? width*height : width*height-1
      for(let f=i*height;f<i*height+height;f++)
        {
          if(f===nbCard && nbCard%2 === 1){
            
          }
          else{
            renderTable.push(this.renderSquare(f))
          }
        }
        return renderTable
    }
    createLines(dim){
      const renderLines=[]
      console.log(dim.width)
      for( let i=0;i< dim.width ;i++){
         renderLines.push(<div className="board-row">{this.createLine(i,dim.width,dim.height)}</div>)
        }
      console.log(renderLines)
      return renderLines
    }

    render() {

        const win ="you win";
        
        const players = this.state.player
        const quiJoue = (id) => this.state.currentPlayer.id === id ? "A ton tour" :""
        const playerInfo= (players) => players.map(x => <div >nom : {x.name} score : {x.score}    {quiJoue(x.id)} </div>);
        
        
      
      return (
        <div>
        <div className="status">{playerInfo(players)}</div>
        <div className="status">{this.createLines(this.props.lengthSelect)}</div>
        </div>
      );
    }
  };
  
  class Game extends React.Component {
    constructor() {
      super();
      
      this.state = {
          gameSelect : false,
          lengthSelect : {width : 4 ,height : 4}
      }
      
      
    }
    handleSubmit(event) {
      if (event.target.value % 2 === 0){
        this.setState({lengthSelect: event.target.value});
      } else {
        console.log("that was odd number")
      }
    }
    render() {
      const gameSelect = () => this.state.gameSelect ? <form onSubmit={this.handleSubmit.bind(this)}><input name="select" type="text" pattern="[0-9]*" required ></input><input type="submit" ></input></form> : "";
      return (
        <div className="game">
          <div >
            {gameSelect()}
          </div>
          <div className="game-board">
            {this.state.gameSelect ? "" :<Board lengthSelect={this.state.lengthSelect}/>}
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateEndgame(squares) {

    const tableVide = squares.filter(x => x.etat === 2);
    if (tableVide.length===squares.length ){
      return true;
    }
    return false;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function selectRandom(length,array){
  const tab=[length]
    for(let i=0; i<length;i++){
      let j=Math.floor(Math.random()* length);
      tab.push(array.splice(j, 1)[0]);
    }
    return tab
}
async function waitingResult(prevstate){
  new Promise(resolve => {
    setTimeout(this.validateClick(prevstate), 10000);
  });
}
