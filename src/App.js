import React, {Component} from 'react';
import './App.css';
import AddConversionForm from './AddConversionForm';
import EditConversionForm from './EditConversionForm';
import DeleteConversionForm from './DeleteConversionForm';

const URL = 'http://localhost:80/currency-calculator/public/action.php';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromValue: "Euro",
      toValue: "US Dollar",
      rate: '1.3764',
      amount: '',
      convertedAmount: '',
      showFormAdd: true,
      showFormEdit: true,
      showFormDelete: true,
      nextConversionId: 2,
      conversions: [
        {
          id:0,
          name: "Euro",
          nextConversionToId: 2,
          conversionTo:[
            {
              id: 0,
              name: "US Dollar",
              rate: 1.3764
            },
            {
              id: 1,
              name: "British Pound",
              rate: 0.8731
            }
          ]
        },
        {
          id:1,
          name: "US Dollar",
          nextConversionToid: 1,
          conversionTo: [
            {
              id: 0,
              name: "JPY",
              rate: 76.7200
            }
          ]
        }
      ]
    }
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleConvert = this.handleConvert.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  } 

  handleConvert(event) {
    event.preventDefault();
    const amount = this.state.amount;
    const rate = this.state.rate;
    let obj = {name: "kon", lname: "dal"};
    let data = JSON.stringify(obj);
    data = "json="+data;
    console.log(data);
    const response = fetch(URL,{
      method:"POST",
      body: data,
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(()=> console.log("WOW"));

    this.setState({convertedAmount: amount * rate});
  }

  handleAmountChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
 
  handleInputChange(event) {
  //handleChange when changing from currency to set to curr and rate
    const target = event.target;
    const name = target.name;
    const value = target.value;

    
    if(name === "fromValue"){
      for(let i=0; i<this.state.conversions.length; i++) {
        if(this.state.conversions[i].name === value){
          const fromValue = value;
          const toValue = this.state.conversions[i].conversionTo[0].name;
          const rate = this.state.conversions[i].conversionTo[0].rate;
          this.setState({fromValue: fromValue, toValue: toValue, rate: rate});
          break;
        }
      }
    }
    else if(name === "toValue") {
      const fromValue = this.state.fromValue;
      for(let i=0; i<this.state.conversions.length; i++) {
        if(this.state.conversions[i].name === fromValue){
          for(let j=0; j<this.state.conversions[i].conversionTo.length; j++){
            if(this.state.conversions[i].conversionTo[j].name === value) {
              const toValue = value;
              const rate = this.state.conversions[i].conversionTo[j].rate;
              this.setState({toValue: toValue, rate: rate});
              break;
            }
          }
        }
      }
    }
  }


  handleAdd(newConversion) {
    const {convertFrom, convertTo, rate} = newConversion;
    let convertFromFound = false;
    let convertFromIdx = null;
    let convertToFound = false;
    const conversions = this.state.conversions.slice();

    for(let i=0; i<conversions.length; i++){
      if(conversions[i].name === newConversion.convertFrom){
          convertFromFound = true;
          convertFromIdx = i;
          const conversionTo = this.state.conversions[i].conversionTo;
          console.log(conversionTo)
          for(let j=0; j<conversionTo.length; j++){
            if(conversionTo[j].name === newConversion.convertTo){
              convertToFound = true;
              break;
            }
          }
      }
    }
    if(convertFromFound && convertToFound) {
      console.log("already done");
    }
    else if(convertFromFound) {
      this.setState((prevState)=> {
        const newConversionTo = {name: convertTo, rate: rate, id:this.state.conversions[convertFromIdx].nextConversionToId, nextConversionToId: this.state.conversions[convertFromIdx].nextConversionToId+1};
        const newConversionsTo = [...this.state.conversions[convertFromIdx].conversionTo, newConversionTo];
        const newConversion = {name: convertFrom, conversionTo: newConversionsTo, id:this.state.conversions[convertFromIdx].id, nextConversionId: this.state.nextConversionId};
        const newConversions = this.state.conversions.slice();
        newConversions[convertFromIdx] = newConversion;
        return {
          conversions: newConversions
        }
      });
    }
    else {
      const newConversionTo = {name:convertTo, rate: rate, id:0};
      const newConversionsTo = [newConversionTo];
      const newConversion = {name: convertFrom, conversionTo: newConversionsTo, nextConversionToId:1, id: this.state.nextConversionId};
      const newConversions = [...this.state.conversions, newConversion];
      this.setState((prevState)=> {
        return {
          conversions: newConversions,
          nextConversionId: prevState.nextConversionId + 1,
        }
      });
      console.log(this.state.conversions);
    }
  }

  handleEdit(editedConversion) {
    const {id, convertFrom, convertTo, rate} = editedConversion;
    const conversions = this.state.conversions.slice();
    for(let i=0; i<conversions.length; i++){
      if(conversions[i].name === convertFrom){
        const conversionsTo = this.state.conversions[i].conversionTo.slice();
        for(let j=0; j<conversionsTo.length; j++) {
          console.log(j)
          if(conversionsTo[j].name === convertTo){
            let newConversionsTo = conversionsTo.slice();
            newConversionsTo[j] = {id: id, name: convertTo, rate: rate};
            let newConversion = conversions[i];
            newConversion.conversionTo = newConversionsTo;
            let newConversions = conversions.slice();
            newConversions[i] = newConversion;
            this.setState({conversions: newConversions});
            break;
          }
        }
        break;
      }
    }
  }

  handleDelete(deletedConversion) {
    const {id, convertFrom, convertTo} = deletedConversion;
    console.log(deletedConversion)
    let conversions = this.state.conversions.slice();
    for(let i=0; i<conversions.length; i++){
      if(conversions[i].name === convertFrom){
        let conversionsTo = this.state.conversions[i].conversionTo.slice();
        if(conversionsTo.length === 1){
          let newConversions = conversions.slice();
          newConversions.splice(i,1);
          for(let z=i; z<newConversions.length; z++){
            newConversions[z].id--;
          }
          let newNextConversionId = this.state.nextConversionId - 1;
          this.setState({conversions: newConversions, nextConversionId: newNextConversionId});
          break;
        }
        else{
          for(let j=0; j<conversionsTo.length; j++) {
            if(conversionsTo[j].name === convertTo){
              let newConversionsTo = conversionsTo.slice();
              newConversionsTo.splice(j,1);
              for(let z=j; z<newConversionsTo.length; z++){
                newConversionsTo[z].id--;
              }
              console.log(newConversionsTo)
              
              let newConversion = conversions[i];
              newConversion.conversionTo = newConversionsTo;
              newConversion.nextConversionToId--;
              let newConversions = conversions.slice();
              newConversions[i] = newConversion;
              console.log(newConversions);
              this.setState({conversions: newConversions});
              break;
            }
          }
        }
        
        break;
      }
    }
  }


  render() {
    console.log("redneder!")
    const fromOptions = this.state.conversions.map((currency, i)=>
      <option key={currency.id} id={currency.id} value={currency.name}>{currency.name}</option>
    );
    
    let conversionOptions = this.state.conversions.slice();
    let newConversions = [];
    for(let i=0; i<conversionOptions.length; i++) {
      if(conversionOptions[i].name === this.state.fromValue){
        newConversions = conversionOptions[i].conversionTo.slice();
        break;
        
      }
    }
    
    const toOptions = newConversions.map((currency, i)=>
          <option key={currency.id} id={currency.id} value={currency.name}>{currency.name}</option>
        )

    
    let editOptions = [];
    let key = 0;
    for(let i=0; i<conversionOptions.length; i++) {
      let conversionToOptions = this.state.conversions[i].conversionTo.slice();
      let conversionFromName = this.state.conversions[i].name;
      for(let j=0; j<conversionToOptions.length; j++) {
        let conversionToName = conversionToOptions[j].name;
        let conversionRate = conversionToOptions[j].rate;
        let name = `${conversionFromName} TO ${conversionToName}`
        let id = conversionToOptions[j].id;
        editOptions.push(<option key={id} id={id} from={conversionFromName} to={conversionToName} value={`${id},${conversionFromName},${conversionToName},${conversionRate}`}>{name}</option>)
        key = key + 1;
      }
    }
    editOptions.push(<option key={key} value="" selected>Select Conversion</option>)


    return(
      <div className="App">
        <div className="container">
          <h2>Currency Calculator</h2>
          <form onSubmit={this.handleConvert}>
            <section className="options">
            <label>From:
              <select name="fromValue" value={this.state.fromValue} onChange={this.handleInputChange}>
                {fromOptions}
              </select>
            </label>
            <label>To:
              <select name="toValue" value={this.state.toValue} onChange={this.handleInputChange}>
                {toOptions}
              </select>
            </label>
            </section>
            <input type="number" name="amount" value={this.state.value} onChange={this.handleAmountChange}/>
            <input type="submit" value="Convert" />
          </form>
          <h1 className="converted">{this.state.convertedAmount}</h1>
        </div>
        {this.state.showFormAdd ?
            <AddConversionForm onAdd={this.handleAdd}/> :
            null }
        {this.state.showFormEdit ?
            <EditConversionForm onEdit={this.handleEdit} options={editOptions}/> :
            null }

        {this.state.showFormDelete ?
            <DeleteConversionForm onDelete={this.handleDelete} options={editOptions}/> :
            null }
      </div>
    );
  }

}
export default App;
