import React, {Component} from 'react';
import './AddConversionForm.css';

class AddConversionForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            convertFrom: '',
            convertTo: '',
            rate: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    

    handleSubmit(event) {
        event.preventDefault();
        this.props.onAdd({...this.state});
        this.setState({
            convertFrom: '',
            convertTo: '',
            rate: ''
        });
    }

    render() {
        return (
            <div className="container" onSubmit={this.handleSubmit}>
                <h2>Add New Conversion</h2>
                <form>
                    <section className="options">
                        <label>From:
                            <input type="text" name="convertFrom" value={this.state.convertFrom} onChange={this.handleChange}></input>
                        </label>
                        <label>To:
                            <input type="text" name="convertTo" value={this.state.convertTo} onChange={this.handleChange}></input>
                        </label>
                    </section>
                    <label>Rate:
                        <input type="text" name="rate" value={this.state.rate} onChange={this.handleChange}></input>
                    </label>
                    
                    
                    <button type="submit" value="Add">Add22eff</button>
                </form>
            </div>
        );
    }
}

export default AddConversionForm;