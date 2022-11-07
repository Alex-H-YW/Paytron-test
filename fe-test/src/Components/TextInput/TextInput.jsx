import PropTypes from 'prop-types';
import classes from './TextInput.module.css'

const TextInput = (props) => {
    const { value, setInput, disabled, label, style} = props;

    const handleChange = (val) => {
        val = val.replace(/[^\d]/g, '');
        setInput(val);
      };

  return (
    <div className={classes.inputContainer} style={style}>
        <label htmlFor='inputField'>{label}</label>
        <input
            className={classes.input}
            type="text"
            name="inputField"
            value={value} 
            onChange={e=>handleChange(e.target.value)}
            disabled={disabled}
        />

    </div>
  )
};

TextInput.propTypes={
    label:PropTypes.string,
    value:PropTypes.number,
    setChange:PropTypes.func,
    disabled:PropTypes.bool,
    style: PropTypes.object,
};

export default TextInput;
