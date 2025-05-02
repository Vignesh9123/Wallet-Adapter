import { ChangeEvent } from "react"

function CustomInput({
    value,
    onChange,
    placeholder
  }:{
    value: string,
    onChange:(e: ChangeEvent<HTMLInputElement>)=>void,
    placeholder:string
  }){
    return(
      <input value={value} onChange={onChange} style={{padding:"10px 10px",backgroundColor:"#0f0f0f", color:"white", fontSize:"18px", marginRight:"5px" }} type="text" placeholder={placeholder}/> 
    )
  }

export default CustomInput
