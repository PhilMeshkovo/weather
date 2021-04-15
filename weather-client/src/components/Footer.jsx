function Footer () {
    return <footer className="page-footer green lighten-1" style={{position: "fixed", bottom: 0}}>
    <div className="footer-copyright">
      <div className="container">
      © {new Date().getFullYear()} Copyright Text
      <a className="white-text text-lighten-4 right" href="https://github.com/PhilMeshkovo/weather" target='_blank' rel='noreferrer'>Repo</a>
      </div>
    </div>
  </footer>
}

export {Footer}