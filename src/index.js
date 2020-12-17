import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import './index.css';

class Square extends React.Component {
  
    render() {
        
        

      return (
        <button className="square" onClick={() => this.props.updateBoard(this.props.index)}>

          {this.props.square.etat === 0 ? "?" : this.props.square.etat ===2 ? null : this.props.square.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
        constructor(props) {
            super(props);
            const arrayNbImage=[]
            const arrayNumber=[]
            //generate fake data
            for(let i = 0; i< this.props.nbImage*2; i++){
              arrayNumber.push(i)
              if( i < this.props.nbImage){
                arrayNbImage.push(i)
              }
              if( i>= this.props.nbImage){
                arrayNbImage.push(i-this.props.nbImage)
              }
            }
            console.log(arrayNbImage)
            console.log(arrayNumber)
            const testTable=[]
            const table = (testTable) => arrayNumber.map(x => testTable.push({id: x, value: arrayNbImage[x] , etat: 0})) 
            
            console.log(table(testTable))
            this.state = {
                table : [
                  { id :0, value: 0, etat: 0},
                  { id :1, value: 1, etat: 0},
                  { id :2, value: 0, etat: 0},
                  { id :3, value: 1, etat: 0},
                  { id :4, value: 2, etat: 0},
                  { id :5, value: 2, etat: 0},
                ],
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
            } else {
                console.log("validateCLick")
                return this.validateClick(prevstate)
            }
            return newState 
        })

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

    playerTurn(prevstate,increment){
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
    render() {
        
        
        const win ="you win";

        const tabAr=[0,1,2,3];
        const players = this.state.player
        const quiJoue = (id) => this.state.currentPlayer.id === id ? "A ton tour" :""
        const playerInfo= (players) => players.map(x => <div >nom : {x.name} score : {x.score}    {quiJoue(x.id)} </div>);
        const lines = (x) => x.forEach(element => <div  > {this.renderSquare(element)} </div>); 
        const x= tabAr
        
        /* const tableau= (long) => tab.map(x=> <div className="board-row">{lines(x.width)} </div> ) */
      return (
        <div>
        <div className="status">{playerInfo(players)}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
        </div>
      );
    }
  };
  
  class Game extends React.Component {
    constructor() {
      super();
      
      this.state = {
          gameSelect : false,
          nbrImage : 4
      }
      
      
    }
    handleSubmit(event) {
      if (event.target.value % 2 === 0){
        this.setState({nbrImage: event.target.value});
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
            {this.state.gameSelect ? "" :<Board nbImage={this.state.nbrImage}/>}
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

    const tableVide = squares.table.filter(x => x.etat === 2);
    if (tableVide.length===squares.length ){
      return true;
    }
    return false;
}
