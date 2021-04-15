import {useState} from 'react'

export function Search({cb = Function.prototype}) {

    const [location, setLocation] = useState('');
    const [temp, setTemp] = useState('');

    const handleKey = (e) => {
        if(e.key === 'Enter') {
            handleSubmit();
        }
    } 

    const handleSubmit = () => {
        fetch("http://localhost:8080/weather/moscow").then(data => setLocation(data.location) && setTemp(data.temp));
    
    }

    return <div className="row">
        <div className="input-field col s12">
            <input type="search" 
            id='search-field'
            placeholder='search'
            onKeyDown={handleKey}
            // onChange={(e) => setValue(e.target.value)}
            // value={value}
            />
            <button className='btn'
            style={{
                position: 'absolute',
                top: 0,
                right: 0
            }}
            onClick={handleSubmit}
            >Search</button>
        </div>
        <div className="row">
            {!location.length ? <h3>{location} - {temp}</h3> : null}
        </div>
    </div>
    
}