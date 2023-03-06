import React, { useState, useEffect, useRef } from 'react';



function ScrollPositionSaver({pageName, numberOfVisibleMems, setNumberOfVisibleMems}) {  




// трэш шапито
    const [y, setY] = useState(0);
    const ref = useRef(0);
    function refreshNumberOfVisibleMems(){
       setNumberOfVisibleMems(21);
       window.sessionStorage.removeItem(pageName)
    }
    function handleScroll(){
                ref.current = (window.scrollY);
            }
    function onPageLoad(){
        setTimeout(() => {
            window.scroll({
                top: Number(window.sessionStorage.getItem(pageName)),
                left: 0,
                behavior: 'smooth'
              } );
          },100);
        window.addEventListener('scroll', handleScroll);
    }        
    useEffect(()=>{
        const sessionStorageNumberOfSavedMemes = Number(window.sessionStorage.getItem('number'));
        if(sessionStorageNumberOfSavedMemes !== 0){
            setNumberOfVisibleMems(sessionStorageNumberOfSavedMemes);
        } else {
            setNumberOfVisibleMems(numberOfVisibleMems);
        }
       
        if (document.readyState === 'complete') {
            onPageLoad();
          } else {
            window.addEventListener('load', onPageLoad);}
        window.addEventListener("beforeunload", refreshNumberOfVisibleMems);
        return(()=>{
            window.sessionStorage.setItem(pageName, ref.current);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('load', onPageLoad);
            window.removeEventListener("beforeunload", refreshNumberOfVisibleMems);
    })
},[])
    useEffect(()=>{
        window.sessionStorage.removeItem('number');
        window.sessionStorage.setItem('number', numberOfVisibleMems);
    },[numberOfVisibleMems])

}            
export default ScrollPositionSaver;