import React, { Component } from 'react';
import * as RecordsAPI from '../utils/RecordsAPI';


export default class RecordForm extends Component {
  constructor(props){
    super(props);
    this.state={
      data:"",
      title:"",
      amount:""
    }
  }

  handleChange(event){
    let name , obj;
    name = event.target.name;
    this.setState((
      obj={},
      obj[""+name] = event.target.value,
      obj
    ))
  }

  handleSubmit(event){
    event.preventDefault();

    const data = {
      data:this.state.data,
      title:this.state.title,
      amount:Number.parseInt(this.state.amount, 0)
    };

    RecordsAPI.create(data).then(
      response => {
        this.props.handleNewRecord(response.data);
        this.setState({
          data:"",
          title:"",
          amount:""
        })
      }
    ).catch(
      error=>console.log(error.message)
    )
  }

  //控制创建记录按钮，当数据，标题，金额都有值是，创建按钮才能点击
  valid(){
    return this.state.data && this.state.title && this.state.amount
  }
  render() {
    return (
      <form className="form-inline mb-3" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group mr-1">
          <input type="text" className="form-control" placeholder="Data" onChange={this.handleChange.bind(this)} name="data" value={this.state.data}/>
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control" placeholder="Title" onChange={this.handleChange.bind(this)} name="title" value={this.state.title}/>
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control" placeholder="Amount" onChange={this.handleChange.bind(this)} name="amount" value={this.state.amount}/>
        </div>
        <button type="submit" className="btn btn-primary"  disabled={!this.valid()} >Ceate Record</button>
      </form>
    );
  }
}
