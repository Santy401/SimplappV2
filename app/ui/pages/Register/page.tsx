import Image from "next/image";
import styles from "../../styles/Modules/input.module.css";
import buttonStyles from "../../styles/Modules/button.module.css";
import dividerStyles from "../../styles/Modules/divider.module.css";
import Link from "next/link";

export default function Register() {
    return (
        <div className="grid grid-cols-2 h-screen overflow-hidden">
            <div className="flex flex-col pl-30 pr-30  flex flex-col justify-center">
                <h1 className="text-4xl font-bold">Create an account</h1>
                <p>Enter your details to sign up</p>
                <form action="" className="flex flex-col mt-10">
                    <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Name" className={styles.input} />

                    <label htmlFor="email" className="mt-5">Email <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Email" className={styles.input} />

                    <label htmlFor="password" className="mt-5">Password <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="Password" className={styles.input} />

                    <button type="submit" className={buttonStyles.loginButton}>Register</button>
                </form>
                <div className={dividerStyles.dividerLogin}></div>
                <p className="text-center">Already have an account ? <Link href="/ui/pages/Login" className="text-bt-color underline">Login here</Link></p>
            </div>
            <div className="relative h-full w-full">
                <Image src="/Login/Login.jpeg" fill className="object-cover" alt="Login" />
            </div>
        </div>
    );
}