import {useState} from 'react'
export function Main() {
    const [location, setLocation] = useState('');
    const [temp, setTemp] = useState('');
    const [value, setValue] = useState('');

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
        console.log(location )
        handleSubmit().then(data => setTemp(data.temp));
        console.log( temp)
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
        <button className='btn'
        style={{
            position: 'absolute',
            top: 0,
            right: 0
        }}
        onClick={search}
        >Search</button>
    </div>
    <div className="row">
        {location.length ? <h3>{location} : {temp}</h3> : <h3>Not found</h3>}
    </div>
    
</div>
}