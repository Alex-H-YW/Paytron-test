import { useState, useEffect } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import TextInput from '../../Components/TextInput/TextInput';
import { markupResultCalculator, trueResultCalculator } from '../../utils';

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState('AU');
  const [toCurrency, setToCurrency] = useState('US');

  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [markupOutput, setMarkupOutput] = useState("");
  const [trueOutput, setTrueOutput] = useState("");

  const Flag = ({ code }) => <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />;

  const fetchData = async () => {
    const sellCurrency = countryToCurrency[fromCurrency];
    const buyCurrency = countryToCurrency[toCurrency];
    if (!loading) {
      setLoading(true); 
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(
          `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`
          );
        const responseData = await response.json();
        if (responseData.retailRate) {
          setExchangeRate(responseData.retailRate);
        } else {
          setExchangeRate();
          setMarkupOutput("not available");
          setTrueOutput("not available");
          
        };
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchData();
  }, [fromCurrency, toCurrency]);


  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  useEffect(()=>{
    if(input) {
    const markupResult = markupResultCalculator(exchangeRate, input);
    const trueResult = trueResultCalculator(exchangeRate, input);
    setMarkupOutput(markupResult);
    setTrueOutput(trueResult);
    }
  },[input, exchangeRate, fromCurrency])

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={'From'}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({ option: countryToCurrency[code], key: code, icon: <Flag code={code} /> }))}
              setSelected={(key) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: '20px' }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={'25px'} />
            </div>
            {/* {loading===false && 
            } */}
            {loading?  (
              <div className={classes.loaderWrapper}>
                <Loader width={'25px'} height={'25px'} />
              </div>
            ):
            (
              <div className={classes.rate}>{exchangeRate}</div>)

            }
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={'To'}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({ option: countryToCurrency[code], key: code, icon: <Flag code={code} /> }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: '20px' }}
            />
          </div>
        </div>
        

        <ProgressBar progress={progression} animationClass={loading ? classes.slow : ''} style={{ marginTop: '20px' }} />

        

        <div className={classes.converter}>
          <div >
            <TextInput value={input} setInput={setInput} label="Enter Amount" style={{ marginRight: '20px' }}/>
          </div>
          <div className={classes.iconWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={'25px'} style={{ margin: '0 15px' }}/>
          </div>
          </div>
          <div className={classes.resultWrapper}>
            <TextInput value={trueOutput} label="True Amount" disabled style={{ marginLeft: '20px' }}/>
            <TextInput value={markupOutput} label="Markup Amount" disabled style={{ marginLeft: '20px' }}/>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Rates;
