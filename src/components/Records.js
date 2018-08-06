import React, { Component } from 'react';
import Record from './Record';
// import {getJSON} from 'jquery';
import * as RecordsAPI from '../utils/RecordsAPI';
import RecordForm from './RecordForm';
import AmountBox from './AmountBox';

class Records extends Component {
  constructor(){
    super()
    this.state={
      records:[],
      isLoading:false,
      error:null
    }
  }

  componentDidMount(){
    //使用JQUERY库，如下
    //仅使用getJSON方法，可以只导入该部分
    //原始：import {$} from 'jquery'; $.getJSON()
    //修改后： import {getJSON} from 'jquery'; getJSON()
     RecordsAPI.getAll().then(
       response =>this.setState({
         records:response.data,
         isLoading:true
       })
     ).catch(
       error => this.setState({
         isLoading:true,
         error:error
       })
     )
  }

  addRecord(record){
    // console.log(record);
    this.setState({
      error:null,
      isLoading:true,
      records:[
        ...this.state.records,
        record
      ]
    })
  }

  updataRecord(record,data){
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.map( (item, index) => {
        if(index !== recordIndex) {
          // This isn't the item we care about - keep it as-is
          return item;
        }
        // Otherwise, this is the one we want - return an updated value
        return {
          ...item,
          ...data
        };
    });
    this.setState({
      records:newRecords
    })
  }

  deleteRecord(record){
    // console.log(record);
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.filter((item,index)=>index !== recordIndex )
    this.setState({
      records:newRecords
    })
  }

  credits(){
    let credits = this.state.records.filter((record)=>{
      return record.amount >=0
    })
    return credits.reduce((prev,curr)=>{
      return prev + Number.parseInt(curr.amount,0)
    },0)
  }

  debits(){
    let credits = this.state.records.filter((record)=>{
      return record.amount <0;
    })
    return credits.reduce((prev,curr)=>{
      return prev + Number.parseInt(curr.amount,0)
    },0)
  }

  balance(){
    return this.credits() + this.debits();
  }

  render() {
    const {error,isLoading,records} = this.state;
    let recordsComponent;
    if(error){
      recordsComponent = <div>Error:{error.message}</div>
    }else if(!isLoading){
      recordsComponent = <div>Loading...</div>
    }else{
      recordsComponent = (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Data</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map( (record,i)=>(
              <Record
                key={record.id}
                record={record}
                handleEditRecord={this.updataRecord.bind(this)}
                handleDeleteRecord={this.deleteRecord.bind(this)}
              />)
          )}
          </tbody>
        </table>
      );
    }

    return(
      <div>
        <h2>Records</h2>
        <div className="row mb-3">
          <AmountBox text="Credit" type="success" amount={this.credits()}/>
          <AmountBox text="Debit" type="danger" amount={this.debits()}/>
          <AmountBox text="Balance" type="info" amount={this.balance()}/>
        </div>
        <RecordForm handleNewRecord={this.addRecord.bind(this)}/>
        {recordsComponent}
      </div>
    )
  }
}

export default Records;
