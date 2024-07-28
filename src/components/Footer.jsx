import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-800 text-white flex flex-col items-center justify-center'>
            <div className="logo font-bold text-2xl">
                <span className='text-green-500'>&lt;</span>
                Pass
                <span className='text-green-500'>OP/&gt;</span>
            </div>
            <div className='flex justify-center items-center'>
                created with <img className='w-7 mx-2' src="../public/heart.png" alt="" /> with help of CodeWithHarry
            </div>
        </div>
    )
}

export default Footer
