

const Button = (
    {
    label='Button',
    type='button',
    className='',
    disabled=false,
    
    }
) => {
  return (
    <div className="w-1/2">

        <button type={type} className={`text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${className}`}  disabled={disabled}>{label}</button>

    </div>
  )
}

export default Button