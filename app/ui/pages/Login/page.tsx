import Image from "next/image";
import styles from "../../styles/Modules/input.module.css";
import buttonStyles from "../../styles/Modules/button.module.css";
import dividerStyles from "../../styles/Modules/divider.module.css";
import Link from "next/link";

export default function Login() {
    return (
        <div className="grid grid-cols-2 h-screen overflow-hidden">
            <div className="flex flex-col pl-30 pr-30  flex flex-col justify-center">
                <h1 className="text-4xl font-bold">Welcome back !</h1>
                <p>Sign in to your account</p>
                <form action="" className="flex flex-col mt-10">
                    <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Email" className={styles.input} />
                    <label htmlFor="password" className="mt-5">Password <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="Password" className={styles.input} />
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center">
                            <input type="checkbox" name="remember" id="remember" />
                            <label htmlFor="remember" className="ml-2">Remember me</label>
                        </div>
                        <div>
                            <p className="text-bt-color underline cursor-pointer">Forgot password ?</p>
                        </div>
                    </div>
                    <button type="submit" className={buttonStyles.loginButton}>Sign in</button>
                </form>
                <div className={dividerStyles.dividerLogin}></div>
                <p className="text-center">Don't have an account ? <Link href="/ui/pages/Register" className="text-bt-color underline">Register here</Link></p>
            </div>
            <div className="relative h-full w-full">
                <Image src="/Login/Login.jpeg" fill className="object-cover" alt="Login" />
            </div>
        </div>
    );
}