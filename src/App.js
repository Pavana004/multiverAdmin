import React from 'react';
import './App.css';
import Table  from './table';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Books from './booksData';
import Album from './album';
import Music from './music';




function App() {
  return (
    <>
    <div className='container'>
        <Table /> 
        <hr/>
        <Books/>
        <hr/>
        <Album/>
        <hr/>
        <Music/>
        <hr/>
    </div>
    <ToastContainer/>
    </>
  );
}

export default App;
