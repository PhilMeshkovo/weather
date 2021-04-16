import {useState} from 'react'
export function Main() {
    const [location, setLocation] = useState('');
    const [temp, setTemp] = useState('');
    const [value, setValue] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newTemp, setNewTemp] = useState('');
    const [errors, setErrors] = useState({});

    const handleKey = (e) => {
        if(e.key === 'Enter') {
            search();
        }
    } 

    const handleKeyNew = (e) => {
        if(e.key === 'Enter') {
           sendNewTemp();
        }
    } 

    const setCityWithValidation = (e) => {
        if(!e.match("([a-zA-Z]+|[a-zA-Z]+\\s[a-zA-Z]+)")) {  
            setErrors({"city": 'Некорректное название города'})
        } else {
            setNewCity(e);
        }
            
    }

    const setTempWithValidation = (e) => {
        if(!e.length || +e > 60 || +e < -100 ) {
            setErrors({"temp": 'Некорректная температура'})
        } else {
            setNewTemp(e)
        }
    }

    const sendNewTemp = async () => {
        if(newCity.length && newTemp.length) {
            const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: newCity, temp: newTemp })
        };
        const response = await fetch('http://localhost:8080/weather/new', requestOptions);
        const data = await response.json();
        console.log(data); 
        } else {
            alert("Введите город и температуру")
        }
    }

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8080/weather/${value}`)
        return await response.json();
    }

    const search = () => {
        handleSubmit().then(data => setLocation(data.location));
        handleSubmit().then(data => setTemp(data.temp));
    }

    return <div className="row">
    <div className="input-field col s12">
        <input type="search" 
        id='search-field'
        placeholder='search'
        onKeyDown={handleKey}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        />
        <button className='btn white-text '
        style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
        }}
        onClick={search}
        >Search &nbsp;<i className="material-icons ">search</i></button>
    </div>
    <div className="row">
        {location != null && location.length ? <h3 className="center green-text">In {location.toUpperCase()}  {temp} &#8451; now</h3> : <h3 className="center green-text">NO SUCH CITY FOUND</h3>}
    </div>
    <div className="row">
        <hr style={{width: '100%'}}/>
        <h4 className="center"><i className="material-icons small">star</i>&nbsp;You can set the weather of your city yourself...  </h4>
    <form className="col s12">
      <div className="row">
        <div className="input-field col s6">
          <i className="material-icons prefix">location_city</i>
          <input
           id="city"
            type="text" 
            placeholder='City'
            size="25"
            className="validate"
            onKeyDown={handleKeyNew}
            onChange={(e) => setCityWithValidation(e.target.value)}
            value={newCity}
            />
            <br/>
          {errors['city'] != null && errors['city'].length ? <span style={{color: "red"}}>{errors['city']}</span> : null}
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix">wb_sunny</i>
          <input 
          id="temp" 
          type="number" 
          pattern="[0-9]*"
          inputMode="numeric"
          className="validate"
          placeholder='Temperature'
          onKeyDown={handleKeyNew}
          onChange={(e) => setTempWithValidation(e.target.value)}
          value={newTemp}
          />
          <br/>
          {errors['temp'] != null && errors['temp'].length ? <span style={{color: "red"}}>{errors['temp']}</span> : null}
          
        </div>
        <button type="submit" style={{display: 'flex', justifyContent: 'center'}} className="btn white-text" onClick={sendNewTemp}>Submit  &nbsp; <i className="material-icons">send</i></button>
      </div>
    </form>
  </div>
    
</div>
}