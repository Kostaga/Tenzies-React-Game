import React from "react";


const Die = ({id,value,isHeld,handleClick}) => {

	return (
		<div 
		onClick={handleClick}
		style= {{backgroundColor: isHeld ? "#59E391" : "white"}}
		className="die">

			<h2>{value}</h2>

		</div>
	)
}


export default Die;