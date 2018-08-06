import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as RecordsAPI from '../utils/RecordsAPI';

export default class Record extends Component {
  constructor(){
    super()
    this.state={
      edit:false
    };
  }

  handleToggle(){
    this.setState({
      edit:!this.state.edit
    })
  }
  //编辑完成后，点击update发生请求
  handleEdit(event){
    event.preventDefault();
    const record={
      data:this.refs.data.value,
      title:this.refs.title.value,
      amount:Number.parseInt(this.refs.amount.value, 0)
    }
    // console.log(record);
    RecordsAPI.update(this.props.record.id,record).then(
      response=>{
        this.setState({edit:false});
        this.props.handleEditRecord(this.props.record,response.data)
      }
    ).catch(
      error=>console.log(error.message)
    )
  }

  handleDeleteRecord(event){
    event.preventDefault();
    RecordsAPI.remove(this.props.record.id).then(
      response => this.props.handleDeleteRecord(this.props.record)
    ).catch(
      error => console.log(error.message)
    )
  }

  recordRow(){
    return (
      <tr>
        <td>{this.props.record.data}</td>
        <td>{this.props.record.title}</td>
        <td>{this.props.record.amount}</td>
        <td>
          <button className="btn btn-info mr-1" onClick={this.handleToggle.bind(this)}>Edit</button>
          <button className="btn btn-danger" onClick={this.handleDeleteRecord.bind(this)}>Delete</button>
        </td>
      </tr>
    );
  }

  recordForm(){
    return(
      <tr>
        <td><input type="text" className="form-control" defaultValue={this.props.record.data} ref="data"/></td>
        <td><input type="text" className="form-control" defaultValue={this.props.record.title} ref="title"/></td>
        <td><input type="text" className="form-control" defaultValue={this.props.record.amount} ref="amount"/></td>
        <td>
          <button className="btn btn-info mr-1" onClick={this.handleEdit.bind(this)}>Updata</button>
          <button className="btn btn-danger" onClick={this.handleToggle.bind(this)}>Cancel</button>
        </td>
      </tr>
    )
  }

  render() {
    if(this.state.edit){
      return this.recordForm();
    }else{
      return this.recordRow();
    }
  }
}

Record.propTypes={
  id:PropTypes.string,
  data:PropTypes.string,
  title:PropTypes.string,
  amount:PropTypes.number
}
