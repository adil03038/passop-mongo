import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const passwordRef = useRef();

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        console.log(passwords);
        setPasswordArray(passwords);
    }

    useEffect(() => {
        getPasswords();
    }, []);

    const copyText = (text) => {
        toast('Copied to Clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text);
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
        passwordRef.current.type = passwordRef.current.type === 'password' ? 'text' : 'password';
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            // Check if the password is being edited
            if (form.id) {
                await fetch("http://localhost:3000/", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: form.id })
                });

                await fetch("http://localhost:3000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });

                setPasswordArray([...passwordArray.filter(item => item.id !== form.id), form]);
            } else {
                const newPassword = { ...form, id: uuidv4() };
                await fetch("http://localhost:3000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPassword)
                });

                setPasswordArray([...passwordArray, newPassword]);
            }

            setForm({ site: "", username: "", password: "" });

            toast('Password saved successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast('Please write input fields character more than 3');
        }
    }

    const deletePassword = async (id) => {
        let answer = confirm(`Are you Sure you want to delete this password?`);
        if (answer) {
            console.log(`Deleting password with id: ${id}`);
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            toast('Password deleted successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const editPassword = (id) => {
        console.log(`Editing password with id: ${id}`);
        const passwordToEdit = passwordArray.find(item => item.id === id);
        setForm(passwordToEdit);
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    }


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />
            <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
            <div className="p-3 md:mycontainer">

                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>
                <div className='flex  flex-col p-4 text-black gap-8 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                        <div className="relative">
                            <input value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" ref={passwordRef} name='password' id='password' />
                            <span className='absolute right-[3px] top-[5px] cursor-pointer' onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash className='p-1' size={26} title='Hide Password' /> : <IoEye className='p-1' size={26} title='Show Password' />}
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='w-fit flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 gap-4 border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover"
                        >
                        </lord-icon>
                        Save Password</button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Paaswords to show</div>}

                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-20">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center py-2 border border-white'>
                                            <div className='flex justify-center items-center gap-3'>
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <div className='cursor-pointer iconcopy' onClick={() => { copyText(item.site) }}>
                                                    <FaCopy size={20} title='Copy' />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className='flex justify-center items-center gap-3'>
                                                <span>{item.username}</span>
                                                <div className='cursor-pointer iconcopy' onClick={() => { copyText(item.username) }}>
                                                    <FaCopy size={20} title='Copy' />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className='flex justify-center items-center gap-3'>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className='cursor-pointer iconcopy' onClick={() => { copyText(item.password) }}>
                                                    <FaCopy size={20} title='Copy' />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="flex justify-center items-center gap-3">
                                                <span className='cursor-pointer'><FaEdit onClick={() => { editPassword(item.id) }} title='Edit' size={20} /></span>
                                                <span className='cursor-pointer'><MdDelete onClick={() => { deletePassword(item.id) }} title='Delete' size={20} /></span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>}

                </div>
            </div>
        </>
    )
}

export default Manager
