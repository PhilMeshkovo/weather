import {useState} from 'react'
export function Main() {
    const [location, setLocation] = useState('');
    const [temp, setTemp] = useState('');
    const [value, setValue] = useState('');

    const [newCity, setNewCity] = useState('');
    const [newTemp, setNewTemp] = useState('');

    const handleKeyNew = (e) => {
        if(e.key === 'Enter') {
           
        }
    } 

    const sendNewTemp = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: newCity, temp: newTemp })
        };
        const response = await fetch('http://localhost:8080/weather/new', requestOptions);
        const data = await response.json();
        console.log(data);
    }

    const handleKey = (e) => {
        if(e.key === 'Enter') {
            search();
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
        <button className='btn white-text'
        style={{
            position: 'absolute',
            top: 0,
            right: 0
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
            className="validate"
            onKeyDown={handleKeyNew}
            onChange={(e) => setNewCity(e.target.value)}
            value={newCity}
            />
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix">wb_sunny</i>
          <input id="temp" type="text" className="validate"
          placeholder='Temperature'
          onKeyDown={handleKeyNew}
          onChange={(e) => setNewTemp(e.target.value)}
          value={newTemp}
          />
        </div>
        <button type="submit" className="btn" onClick={sendNewTemp}>Submit  &nbsp; <i className="material-icons">send</i></button>
      </div>
    </form>
  </div>
    
</div>
}