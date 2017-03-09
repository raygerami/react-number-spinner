import './style.scss';
import classNames from 'classnames';
import toThousands from 'to-thousands';
import noop from 'noop';

export default class extends React.Component{
  static propTypes = {
    cssClass:React.PropTypes.string,
    min:React.PropTypes.number,
    max:React.PropTypes.number,
    step:React.PropTypes.number,
    value:React.PropTypes.string,
    precision:React.PropTypes.number,
    readOnly:React.PropTypes.bool,
    disabled:React.PropTypes.bool,
    onInputClick:React.PropTypes.func,
    onChange:React.PropTypes.func,
    pulsText:React.PropTypes.string,
    minusText:React.PropTypes.string,
    size:React.PropTypes.string,
    width:React.PropTypes.string,
    value:React.PropTypes.string,
    showThousand:React.PropTypes.bool
  };

  static defaultProps = {
    min:0,
    max:100,
    step:10,
    precision:2,
    value:'',
    readOnly:false,
    disabled:false,
    showThousand:false,
    onInputClick:noop,
    onChange:noop,
    pulsText:'+',
    minusText:'-',
    size:'18px',
    width:'100%',
    value:'0.00'
  };

  constructor(props){
    super(props);
    this.state = {
      value:props.value,
      readOnly:props.readOnly,
      disabled:props.disabled,
    };
  }

  _click(args,ev){
    this[args]();
    ev.preventDefault();
  }

  _inputChange(ev){
    var value = ev.target.value ;
    this.change(value);
    this.change(value,'input');
  }

  plus(){
    var value = parseFloat(this.state.value) + this.props.step;
    this.change(value,'plus');
  }

  minus(){
    var value = parseFloat(this.state.value) - this.props.step;
    this.change(value,'minus');
  }

  change(inValue,inAction){
    var value = this.checkValue(inValue,inAction);
    this.setState({ value },()=>{
        this.props.onChange({ value, action:inAction });
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState(nextProps);
  }

  checkValue(inValue,inAction){
    var max = this.props.max;
    var min = this.props.min;

    switch(inAction){
      case 'plus':
        return Math.max(max,inValue);
      case 'minus':
        return Math.min(inValue,min);
      default:
        return inValue;
    }
  }

  processValue(inValue){
    var precisionValue = parseFloat(inValue).toFixed(this.props.precision);
    if(this.props.showThousand){
      return toThousands(precisionValue);
    }
    return precisionValue;
  }

  render(){
    return (
      <div
        style={{
          width:this.props.width,
          fontSize:this.props.size
        }}
        className={classNames('react-number-spinner',this.props.cssClass)}>
        <button
          disabled={this.state.value == this.props.max}
          className="plus" onClick={this._click.bind(this,'plus')}>
          <span>{this.props.pulsText}</span>
        </button>
        <button
          disabled={this.state.value == this.props.min}
          className="minus" onClick={this._click.bind(this,'minus')}>
          <span>{this.props.minusText}</span>
        </button>
        <input className="input" pattern='[0-9]*'
          readOnly={this.state.readOnly}
          disabled={this.state.disabled}
          onClick={this.props.onInputClick}
          value={this.processValue(this.state.value)} onChange={this._inputChange.bind(this)} />
      </div>
    );
  }
}
